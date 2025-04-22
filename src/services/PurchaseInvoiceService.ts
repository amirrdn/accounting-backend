import { Repository } from "typeorm";
import { PurchaseInvoice, PurchaseInvoiceStatus } from "../entity/PurchaseInvoice";
import { PurchaseInvoiceItem } from "../entity/PurchaseInvoiceItem";
import { AppDataSource } from "../data-source";
import { CreatePurchaseInvoiceDto, UpdatePurchaseInvoiceDto } from "../types/purchase-invoice.dto";
import { JournalHelper } from "../utils/JournalHelper";
import { Product } from "../entity/Product";
import { Supplier } from "../entity/Supplier";
import { Branch } from "../entity/Branch";
import { Account } from "../entity/Account";
import * as fs from 'fs';
import * as path from 'path';
import { Like } from "typeorm";

export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export class PurchaseInvoiceService {
  private purchaseInvoiceRepository: Repository<PurchaseInvoice>;
  private purchaseInvoiceItemRepository: Repository<PurchaseInvoiceItem>;
  private productRepository: Repository<Product>;
  private supplierRepository: Repository<Supplier>;
  private branchRepository: Repository<Branch>;
  private accountRepository: Repository<Account>;
  private uploadDir: string;

  constructor() {
    this.purchaseInvoiceRepository = AppDataSource.getRepository(PurchaseInvoice);
    this.purchaseInvoiceItemRepository = AppDataSource.getRepository(PurchaseInvoiceItem);
    this.productRepository = AppDataSource.getRepository(Product);
    this.supplierRepository = AppDataSource.getRepository(Supplier);
    this.branchRepository = AppDataSource.getRepository(Branch);
    this.accountRepository = AppDataSource.getRepository(Account);
    this.uploadDir = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const lastInvoice = await this.purchaseInvoiceRepository.findOne({
      where: {
        invoiceNumber: Like(`INV-${year}${month}-%`)
      },
      order: {
        invoiceNumber: 'DESC'
      }
    });
    
    let sequence = 1;
    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(/INV-\d{6}-(\d+)/);
      if (match && match[1]) {
        sequence = parseInt(match[1]) + 1;
      }
    }
    
    return `INV-${year}${month}-${String(sequence).padStart(5, '0')}`;
  }

  private async saveFile(file: UploadedFile): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    return `/uploads/${fileName}`;
  }

  async getAll() {
    return this.purchaseInvoiceRepository.find({
      relations: [
        "supplier",
        "purchaseOrder",
        "purchaseReceipt",
        "items",
        "items.product",
        "payableAccount",
        "branch"
      ]
    });
  }

  async getById(id: number) {
    return this.purchaseInvoiceRepository.findOne({
      where: { id },
      relations: [
        "supplier",
        "purchaseOrder",
        "purchaseReceipt",
        "items",
        "items.product",
        "payableAccount",
        "branch",
        "supplier"
      ]
    });
  }

  async create(dto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoice> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoiceNumber = await this.generateInvoiceNumber();
      
      const purchaseInvoice = this.purchaseInvoiceRepository.create({
        ...dto,
        invoiceNumber,
        status: PurchaseInvoiceStatus.UNPAID,
        items: dto.items.map(item => this.purchaseInvoiceItemRepository.create({
          ...item,
          subtotal: item.quantity * item.unitPrice,
          total: (item.quantity * item.unitPrice) - (item.discount || 0)
        })),
        paidAmount: 0,
        remainingAmount: dto.totalAmount
      });

      await queryRunner.manager.save(purchaseInvoice);

      await JournalHelper.createJournal({
        reference: `PURCHASE-${purchaseInvoice.invoiceNumber}`,
        description: `Pembelian dari ${purchaseInvoice.supplier.name}`,
        entries: [
          {
            accountId: purchaseInvoice.items[0].product.purchase_account.id,
            debit: purchaseInvoice.subtotal,
            credit: 0,
          },
          {
            accountId: purchaseInvoice.payableAccount.id,
            debit: 0,
            credit: purchaseInvoice.totalAmount,
          }
        ]
      });

      await queryRunner.commitTransaction();
      return purchaseInvoice;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, data: UpdatePurchaseInvoiceDto) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchaseInvoice = await this.getById(id);
      if (!purchaseInvoice) {
        throw new Error("Purchase invoice not found");
      }

      if (data.paidAmount !== undefined) {
        const remainingAmount = purchaseInvoice.totalAmount - data.paidAmount;
        if (remainingAmount <= 0) {
          data.status = PurchaseInvoiceStatus.PAID_FULL;
        } else if (data.paidAmount > 0) {
          data.status = PurchaseInvoiceStatus.PAID_PARTIAL;
        }
        data.remainingAmount = remainingAmount;
      }

      await queryRunner.manager.update(PurchaseInvoice, id, data);
      
      await queryRunner.commitTransaction();
      return this.getById(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    return this.purchaseInvoiceRepository.delete(id);
  }

  async createPurchaseInvoice(data: any, file?: UploadedFile) {
    const invoiceData = typeof data === 'string' ? JSON.parse(data) : data;

    const supplier = await this.supplierRepository.findOne({ where: { id: invoiceData.supplierId } });
    if (!supplier) throw new Error("Supplier tidak ditemukan");

    const branch = await this.branchRepository.findOne({ where: { id: invoiceData.branchId } });
    if (!branch) throw new Error("Cabang tidak ditemukan");

    const payableAccount = await this.accountRepository.findOne({ where: { id: invoiceData.payableAccountId } });
    if (!payableAccount) throw new Error("Akun hutang tidak ditemukan");

    const invoiceNumber = await this.generateInvoiceNumber();

    const purchaseInvoice = new PurchaseInvoice();
    purchaseInvoice.invoiceNumber = invoiceNumber;
    purchaseInvoice.invoiceDate = new Date(invoiceData.invoiceDate);
    purchaseInvoice.dueDate = new Date(invoiceData.dueDate);
    purchaseInvoice.supplier = supplier;
    purchaseInvoice.branch = branch;
    purchaseInvoice.payableAccount = payableAccount;
    purchaseInvoice.status = PurchaseInvoiceStatus.UNPAID;
    purchaseInvoice.notes = invoiceData.notes || "";
    purchaseInvoice.isPpn = invoiceData.isPpn || false;
    purchaseInvoice.isPph = invoiceData.isPph || false;
    purchaseInvoice.ppnRate = invoiceData.ppnRate || 0;
    purchaseInvoice.pphRate = invoiceData.pphRate || 0;
    purchaseInvoice.attachmentUrl = file ? await this.saveFile(file) : "";

    let subtotal = 0;
    const items = [];

    for (const itemData of invoiceData.items) {
      const product = await this.productRepository.findOne({ where: { id: itemData.productId } });
      if (!product) throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);

      const item = new PurchaseInvoiceItem();
      item.product = product;
      item.quantity = Number(itemData.quantity);
      item.unitPrice = itemData.unitPrice;
      item.discount = itemData.discount || 0;

      const itemSubtotal = item.quantity * item.unitPrice;
      item.subtotal = itemSubtotal;
      item.taxAmount = itemData.taxAmount || 0;
      item.total = itemSubtotal - item.discount;

      subtotal += itemSubtotal;
      items.push(item);
    }

    purchaseInvoice.subtotal = subtotal;
    purchaseInvoice.taxAmount = invoiceData.taxAmount || 0;
    purchaseInvoice.totalAmount = invoiceData.totalAmount || subtotal;
    purchaseInvoice.paidAmount = 0;
    purchaseInvoice.remainingAmount = purchaseInvoice.totalAmount;

    const savedPurchaseInvoice = await this.purchaseInvoiceRepository.save(purchaseInvoice);

    for (const item of items) {
      item.purchaseInvoice = savedPurchaseInvoice;
      await this.purchaseInvoiceItemRepository.save(item);
    }

    return savedPurchaseInvoice;
  }

  async updatePurchaseInvoice(id: number, data: any, file?: UploadedFile) {
    const purchaseInvoice = await this.purchaseInvoiceRepository.findOne({ where: { id } });
    if (!purchaseInvoice) throw new Error("Invoice tidak ditemukan");

    if (purchaseInvoice.status !== PurchaseInvoiceStatus.UNPAID) {
      throw new Error("Hanya Invoice dengan status UNPAID yang dapat diupdate");
    }

    const supplier = await this.supplierRepository.findOne({ where: { id: data.supplierId } });
    if (!supplier) throw new Error("Supplier tidak ditemukan");

    const branch = await this.branchRepository.findOne({ where: { id: data.branchId } });
    if (!branch) throw new Error("Cabang tidak ditemukan");

    const payableAccount = await this.accountRepository.findOne({ where: { id: data.payableAccountId } });
    if (!payableAccount) throw new Error("Akun hutang tidak ditemukan");

    purchaseInvoice.invoiceNumber = data.invoiceNumber;
    purchaseInvoice.invoiceDate = new Date(data.invoiceDate);
    purchaseInvoice.dueDate = new Date(data.dueDate);
    purchaseInvoice.supplier = supplier;
    purchaseInvoice.branch = branch;
    purchaseInvoice.payableAccount = payableAccount;
    purchaseInvoice.notes = data.notes || "";
    purchaseInvoice.isPpn = data.isPpn || false;
    purchaseInvoice.isPph = data.isPph || false;
    purchaseInvoice.ppnRate = data.ppnRate || 0;
    purchaseInvoice.pphRate = data.pphRate || 0;

    if (file) {
      if (purchaseInvoice.attachmentUrl) {
        const oldFilePath = path.join(__dirname, '../..', purchaseInvoice.attachmentUrl);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath);
        }
      }
      purchaseInvoice.attachmentUrl = await this.saveFile(file);
    }

    await this.purchaseInvoiceItemRepository.delete({ purchaseInvoice: { id } });

    let subtotal = 0;
    const items = [];

    for (const itemData of data.items) {
      const product = await this.productRepository.findOne({ where: { id: itemData.productId } });
      if (!product) throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);

      const item = new PurchaseInvoiceItem();
      item.product = product;
      item.quantity = Number(itemData.quantity);
      item.unitPrice = itemData.unitPrice;
      item.discount = itemData.discount || 0;

      const itemSubtotal = item.quantity * item.unitPrice;
      item.subtotal = itemSubtotal;
      item.taxAmount = itemData.taxAmount || 0;
      item.total = itemSubtotal - item.discount;

      subtotal += itemSubtotal;
      items.push(item);
    }

    purchaseInvoice.subtotal = subtotal;
    purchaseInvoice.taxAmount = data.taxAmount || 0;
    purchaseInvoice.totalAmount = data.totalAmount || subtotal;
    purchaseInvoice.remainingAmount = purchaseInvoice.totalAmount - purchaseInvoice.paidAmount;
    purchaseInvoice.items = items;

    return await this.purchaseInvoiceRepository.save(purchaseInvoice);
  }

  async getPurchaseInvoices() {
    return await this.purchaseInvoiceRepository.find({
      relations: ["supplier", "branch", "payableAccount", "items", "items.product"],
      order: { createdAt: "DESC" }
    });
  }

  async getPurchaseInvoiceById(id: number) {
    const purchaseInvoice = await this.purchaseInvoiceRepository.findOne({
      where: { id },
      relations: ["supplier", "branch", "payableAccount", "items", "items.product"]
    });
    if (!purchaseInvoice) throw new Error("Invoice tidak ditemukan");
    return purchaseInvoice;
  }

  async updatePurchaseInvoiceStatus(id: number, status: PurchaseInvoiceStatus) {
    const purchaseInvoice = await this.purchaseInvoiceRepository.findOne({ where: { id } });
    if (!purchaseInvoice) throw new Error("Invoice tidak ditemukan");

    purchaseInvoice.status = status;
    return await this.purchaseInvoiceRepository.save(purchaseInvoice);
  }

  async deletePurchaseInvoice(id: number) {
    const purchaseInvoice = await this.purchaseInvoiceRepository.findOne({ where: { id } });
    if (!purchaseInvoice) throw new Error("Invoice tidak ditemukan");

    if (purchaseInvoice.status !== PurchaseInvoiceStatus.UNPAID) {
      throw new Error("Hanya Invoice dengan status UNPAID yang dapat dihapus");
    }

    if (purchaseInvoice.attachmentUrl) {
      const filePath = path.join(__dirname, '../..', purchaseInvoice.attachmentUrl);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }

    return await this.purchaseInvoiceRepository.remove(purchaseInvoice);
  }
}
