import { AppDataSource } from "../data-source";
import { PurchaseOrder } from "../entity/PurchaseOrder";
import { PurchaseOrderItem } from "../entity/PurchaseOrderItem";
import { Product } from "../entity/Product";
import { Supplier } from "../entity/Supplier";
import { Branch } from "../entity/Branch";
import { PurchaseOrderStatus } from "../entity/PurchaseOrder";
import * as fs from 'fs';
import * as path from 'path';
import { User } from "../entity/User";

export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export class PurchaseOrderService {
    private purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
    private purchaseOrderItemRepository = AppDataSource.getRepository(PurchaseOrderItem);
    private productRepository = AppDataSource.getRepository(Product);
    private supplierRepository = AppDataSource.getRepository(Supplier);
    private branchRepository = AppDataSource.getRepository(Branch);
    private uploadDir = path.join(__dirname, '../../uploads');

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    private async saveFile(file: UploadedFile): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, fileName);
        await fs.promises.writeFile(filePath, file.buffer);
        return `/uploads/${fileName}`;
    }

    async createPurchaseOrder(data: any, file?: UploadedFile) {
        const poData = typeof data === 'string' ? JSON.parse(data) : data;

        const supplier = await this.supplierRepository.findOne({ where: { id: poData.supplierId } });
        if (!supplier) throw new Error("Supplier tidak ditemukan");

        const branch = await this.branchRepository.findOne({ where: { id: poData.branchId } });
        if (!branch) throw new Error("Cabang tidak ditemukan");

        const purchaseOrder = new PurchaseOrder();
        purchaseOrder.poNumber = `PO-${Date.now()}`;
        purchaseOrder.orderDate = new Date(poData.orderDate);
        purchaseOrder.expectedDeliveryDate = new Date(poData.expectedDeliveryDate);
        purchaseOrder.supplier = supplier;
        purchaseOrder.branch = branch;
        purchaseOrder.status = PurchaseOrderStatus.DRAFT;
        purchaseOrder.notes = poData.notes || "";
        purchaseOrder.isPpn = poData.isPpn || false;
        purchaseOrder.isPph = poData.isPph || false;
        purchaseOrder.ppnRate = poData.ppnRate || 0;
        purchaseOrder.pphRate = poData.pphRate || 0;
        purchaseOrder.attachmentUrl = file ? await this.saveFile(file) : "";

        let subtotal = 0;
        const items = [];

        for (const itemData of poData.items) {
            const product = await this.productRepository.findOne({ where: { id: itemData.productId } });
            if (!product) throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);

            const item = new PurchaseOrderItem();
            item.product = product;
            item.quantity = Number(itemData.quantity);
            item.unitPrice = itemData.price;
            item.discount = 0;

            const itemSubtotal = item.quantity * item.unitPrice;
            item.subtotal = itemSubtotal;
            item.taxAmount = 0;
            item.total = itemSubtotal;

            subtotal += itemSubtotal;
            items.push(item);
        }

        purchaseOrder.subtotal = subtotal;
        purchaseOrder.taxAmount = poData.taxAmount || 0;
        purchaseOrder.totalAmount = poData.totalAmount || subtotal;

        const savedPurchaseOrder = await this.purchaseOrderRepository.save(purchaseOrder);

        for (const item of items) {
            item.purchaseOrder = savedPurchaseOrder;
            await this.purchaseOrderItemRepository.save(item);
        }

        return savedPurchaseOrder;
    }

    async updatePurchaseOrder(id: string, data: any, file?: UploadedFile) {
        const purchaseOrder = await this.purchaseOrderRepository.findOne({ where: { id } });
        if (!purchaseOrder) throw new Error("Purchase Order tidak ditemukan");

        if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
            throw new Error("Hanya Purchase Order dengan status DRAFT yang dapat diupdate");
        }

        const supplier = await this.supplierRepository.findOne({ where: { id: data.supplierId } });
        if (!supplier) throw new Error("Supplier tidak ditemukan");

        const branch = await this.branchRepository.findOne({ where: { id: data.branchId } });
        if (!branch) throw new Error("Cabang tidak ditemukan");

        purchaseOrder.orderDate = new Date(data.orderDate);
        purchaseOrder.expectedDeliveryDate = new Date(data.expectedDeliveryDate);
        purchaseOrder.supplier = supplier;
        purchaseOrder.branch = branch;
        purchaseOrder.notes = data.notes || "";
        purchaseOrder.isPpn = data.isPpn || false;
        purchaseOrder.isPph = data.isPph || false;
        purchaseOrder.ppnRate = data.ppnRate || 0;
        purchaseOrder.pphRate = data.pphRate || 0;

        if (file) {
            if (purchaseOrder.attachmentUrl) {
                const oldFilePath = path.join(__dirname, '../..', purchaseOrder.attachmentUrl);
                if (fs.existsSync(oldFilePath)) {
                    await fs.promises.unlink(oldFilePath);
                }
            }
            purchaseOrder.attachmentUrl = await this.saveFile(file);
        }

        await this.purchaseOrderItemRepository.delete({ purchaseOrder: { id } });

        let subtotal = 0;
        const items = [];

        for (const itemData of data.items) {
            const product = await this.productRepository.findOne({ where: { id: itemData.productId } });
            if (!product) throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);

            const item = new PurchaseOrderItem();
            item.product = product;
            item.quantity = Number(itemData.quantity);
            item.unitPrice = itemData.price;
            item.discount = 0;

            const itemSubtotal = item.quantity * item.unitPrice;
            item.subtotal = itemSubtotal;
            item.taxAmount = 0;
            item.total = itemSubtotal;

            subtotal += itemSubtotal;
            items.push(item);
        }

        purchaseOrder.subtotal = subtotal;
        purchaseOrder.taxAmount = data.taxAmount || 0;
        purchaseOrder.totalAmount = data.totalAmount || subtotal;
        purchaseOrder.items = items;

        return await this.purchaseOrderRepository.save(purchaseOrder);
    }

    async getPurchaseOrders() {
        return await this.purchaseOrderRepository.find({
            relations: ["supplier", "branch", "items", "items.product"],
            order: { createdAt: "DESC" }
        });
    }

    async getPurchaseOrderById(id: string) {
        const purchaseOrder = await this.purchaseOrderRepository.findOne({
            where: { id },
            relations: ["supplier", "branch", "items", "items.product"]
        });
        if (!purchaseOrder) throw new Error("Purchase Order tidak ditemukan");
        return purchaseOrder;
    }

    async updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus, userId: number, approvalNotes?: string) {
        const purchaseOrder = await this.purchaseOrderRepository.findOne({ where: { id } });
        if (!purchaseOrder) throw new Error("Purchase Order tidak ditemukan");

        if (status === PurchaseOrderStatus.APPROVED) {
            if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
                throw new Error("Hanya Purchase Order dengan status DRAFT yang dapat disetujui");
            }

            const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
            if (!user) throw new Error("User tidak ditemukan");

            purchaseOrder.approvalNotes = approvalNotes || "";
            purchaseOrder.approvalDate = new Date();
            purchaseOrder.approvedBy = user;
        }

        purchaseOrder.status = status;
        return await this.purchaseOrderRepository.save(purchaseOrder);
    }

    async deletePurchaseOrder(id: string) {
        const purchaseOrder = await this.purchaseOrderRepository.findOne({ where: { id } });
        if (!purchaseOrder) throw new Error("Purchase Order tidak ditemukan");

        if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
            throw new Error("Hanya Purchase Order dengan status DRAFT yang dapat dihapus");
        }

        if (purchaseOrder.attachmentUrl) {
            const filePath = path.join(__dirname, '../..', purchaseOrder.attachmentUrl);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        }

        return await this.purchaseOrderRepository.remove(purchaseOrder);
    }
} 