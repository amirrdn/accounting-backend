import { Repository } from "typeorm";
import { PurchaseReceipt, PurchaseReceiptStatus } from "../entity/PurchaseReceipt";
import { PurchaseReceiptItem } from "../entity/PurchaseReceiptItem";
import { AppDataSource } from "../data-source";
import { PurchaseOrder } from "../entity/PurchaseOrder";
import { Branch } from "../entity/Branch";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
import { CreatePurchaseReceiptDto } from "../types/purchase-receipt.dto";
import { Like } from "typeorm";

export class PurchaseReceiptService {
    private purchaseReceiptRepository: Repository<PurchaseReceipt>;
    private purchaseReceiptItemRepository: Repository<PurchaseReceiptItem>;
    private purchaseOrderRepository: Repository<PurchaseOrder>;
    private branchRepository: Repository<Branch>;
    private productRepository: Repository<Product>;
    private userRepository: Repository<User>;

    constructor() {
        this.purchaseReceiptRepository = AppDataSource.getRepository(PurchaseReceipt);
        this.purchaseReceiptItemRepository = AppDataSource.getRepository(PurchaseReceiptItem);
        this.purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
        this.branchRepository = AppDataSource.getRepository(Branch);
        this.productRepository = AppDataSource.getRepository(Product);
        this.userRepository = AppDataSource.getRepository(User);
    }

    private async generateReceiptNumber(): Promise<string> {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        
        const lastReceipt = await this.purchaseReceiptRepository.findOne({
            where: {
                receiptNumber: Like(`PR-${year}${month}%`)
            },
            order: { receiptNumber: 'DESC' }
        });

        let sequence = 1;
        if (lastReceipt) {
            const lastSequence = parseInt(lastReceipt.receiptNumber.split('-')[2]);
            sequence = lastSequence + 1;
        }

        return `PR-${year}${month}-${String(sequence).padStart(4, '0')}`;
    }

    async createReceipt(data: CreatePurchaseReceiptDto) {
        const purchaseOrder = await this.purchaseOrderRepository.findOne({ 
            where: { id: data.purchaseOrderId },
            relations: ['supplier']
        });
        if (!purchaseOrder) throw new Error('Purchase Order tidak ditemukan');

        const branch = await this.branchRepository.findOne({ where: { id: data.branchId } });
        if (!branch) throw new Error('Cabang tidak ditemukan');

        const receipt = new PurchaseReceipt();
        receipt.receiptNumber = await this.generateReceiptNumber();
        receipt.purchaseOrder = purchaseOrder;
        receipt.branch = branch;
        receipt.receiptDate = data.receiptDate;
        receipt.notes = data.notes || '';
        receipt.status = PurchaseReceiptStatus.DRAFT;

        const savedReceipt = await this.purchaseReceiptRepository.save(receipt);

        let totalAmount = 0;
        const items = [];

        if (!Array.isArray(data.items)) {
            throw new Error('Items harus berupa array');
        }

        for (const itemData of data.items) {
            if (!itemData.productId || !itemData.quantity || !itemData.unitPrice) {
                throw new Error('Data item tidak lengkap');
            }

            const product = await this.productRepository.findOne({ where: { id: itemData.productId } });
            if (!product) throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);

            const item = new PurchaseReceiptItem();
            item.purchaseReceipt = savedReceipt;
            item.product = product;
            item.quantity = Number(itemData.quantity);
            item.unitPrice = Number(itemData.unitPrice);
            item.subtotal = item.quantity * item.unitPrice;

            totalAmount += item.subtotal;
            items.push(item);
        }

        await this.purchaseReceiptItemRepository.save(items);

        savedReceipt.totalAmount = totalAmount;
        return await this.purchaseReceiptRepository.save(savedReceipt);
    }

    async getReceipts() {
        return await this.purchaseReceiptRepository.find({
            relations: ['purchaseOrder', 'purchaseOrder.supplier', 'branch', 'items', 'items.product'],
            order: { createdAt: 'DESC' }
        });
    }

    async getReceiptById(id: string) {
        const receipt = await this.purchaseReceiptRepository.findOne({
            where: { id },
            relations: ['purchaseOrder', 'purchaseOrder.supplier', 'branch', 'items', 'items.product']
        });
        if (!receipt) throw new Error('Purchase Receipt tidak ditemukan');
        return receipt;
    }

    async updateReceipt(id: string, data: {
        receiptDate?: Date;
        notes?: string;
        items?: {
            productId: number;
            quantity: number;
            unitPrice: number;
        }[];
    }) {
        const receipt = await this.purchaseReceiptRepository.findOne({ 
            where: { id },
            relations: ['items']
        });
        if (!receipt) throw new Error('Purchase Receipt tidak ditemukan');

        if (receipt.status !== PurchaseReceiptStatus.DRAFT) {
            throw new Error('Hanya bisa mengubah Purchase Receipt dengan status DRAFT');
        }

        if (data.receiptDate) receipt.receiptDate = data.receiptDate;
        if (data.notes) receipt.notes = data.notes;

        if (data.items) {
            await this.purchaseReceiptItemRepository.remove(receipt.items);

            let totalAmount = 0;
            const items = [];

            for (const itemData of data.items) {
                const product = await this.productRepository.findOne({ where: { id: itemData.productId } });
                if (!product) throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);

                const item = new PurchaseReceiptItem();
                item.product = product;
                item.quantity = Number(itemData.quantity);
                item.unitPrice = itemData.unitPrice;
                item.subtotal = item.quantity * item.unitPrice;

                totalAmount += item.subtotal;
                items.push(item);
            }

            receipt.items = items;
            receipt.totalAmount = totalAmount;
        }

        return await this.purchaseReceiptRepository.save(receipt);
    }

    async deleteReceipt(id: string) {
        const receipt = await this.purchaseReceiptRepository.findOne({ where: { id } });
        if (!receipt) throw new Error('Purchase Receipt tidak ditemukan');

        if (receipt.status !== PurchaseReceiptStatus.DRAFT) {
            throw new Error('Hanya bisa menghapus Purchase Receipt dengan status DRAFT');
        }

        await this.purchaseReceiptRepository.remove(receipt);
    }

    async updateReceiptStatus(id: string, status: PurchaseReceiptStatus) {
        const receipt = await this.purchaseReceiptRepository.findOne({ where: { id } });
        if (!receipt) throw new Error('Purchase Receipt tidak ditemukan');

        receipt.status = status;
        return await this.purchaseReceiptRepository.save(receipt);
    }

    async filterReceipts(filters: {
        startDate?: Date;
        endDate?: Date;
        branchId?: number;
        supplierId?: number;
        status?: PurchaseReceiptStatus;
    }) {
        const query = this.purchaseReceiptRepository.createQueryBuilder('receipt')
            .leftJoinAndSelect('receipt.purchaseOrder', 'order')
            .leftJoinAndSelect('order.supplier', 'supplier')
            .leftJoinAndSelect('receipt.branch', 'branch')
            .leftJoinAndSelect('receipt.items', 'items')
            .leftJoinAndSelect('items.product', 'product');

        if (filters.startDate && filters.endDate) {
            query.andWhere('receipt.receiptDate BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate
            });
        }

        if (filters.branchId) {
            query.andWhere('receipt.branchId = :branchId', { branchId: filters.branchId });
        }

        if (filters.supplierId) {
            query.andWhere('order.supplierId = :supplierId', { supplierId: filters.supplierId });
        }

        if (filters.status) {
            query.andWhere('receipt.status = :status', { status: filters.status });
        }

        return await query.getMany();
    }
} 