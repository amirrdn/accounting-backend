"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseReceiptService = void 0;
const PurchaseReceipt_1 = require("../entity/PurchaseReceipt");
const PurchaseReceiptItem_1 = require("../entity/PurchaseReceiptItem");
const data_source_1 = require("../data-source");
const PurchaseOrder_1 = require("../entity/PurchaseOrder");
const Branch_1 = require("../entity/Branch");
const Product_1 = require("../entity/Product");
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
class PurchaseReceiptService {
    constructor() {
        this.purchaseReceiptRepository = data_source_1.AppDataSource.getRepository(PurchaseReceipt_1.PurchaseReceipt);
        this.purchaseReceiptItemRepository = data_source_1.AppDataSource.getRepository(PurchaseReceiptItem_1.PurchaseReceiptItem);
        this.purchaseOrderRepository = data_source_1.AppDataSource.getRepository(PurchaseOrder_1.PurchaseOrder);
        this.branchRepository = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
        this.productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    generateReceiptNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const lastReceipt = yield this.purchaseReceiptRepository.findOne({
                where: {
                    receiptNumber: (0, typeorm_1.Like)(`PR-${year}${month}%`)
                },
                order: { receiptNumber: 'DESC' }
            });
            let sequence = 1;
            if (lastReceipt) {
                const lastSequence = parseInt(lastReceipt.receiptNumber.split('-')[2]);
                sequence = lastSequence + 1;
            }
            return `PR-${year}${month}-${String(sequence).padStart(4, '0')}`;
        });
    }
    createReceipt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseOrder = yield this.purchaseOrderRepository.findOne({
                where: { id: data.purchaseOrderId },
                relations: ['supplier']
            });
            if (!purchaseOrder)
                throw new Error('Purchase Order tidak ditemukan');
            const branch = yield this.branchRepository.findOne({ where: { id: data.branchId } });
            if (!branch)
                throw new Error('Cabang tidak ditemukan');
            const receipt = new PurchaseReceipt_1.PurchaseReceipt();
            receipt.receiptNumber = yield this.generateReceiptNumber();
            receipt.purchaseOrder = purchaseOrder;
            receipt.branch = branch;
            receipt.receiptDate = data.receiptDate;
            receipt.notes = data.notes || '';
            receipt.status = PurchaseReceipt_1.PurchaseReceiptStatus.DRAFT;
            const savedReceipt = yield this.purchaseReceiptRepository.save(receipt);
            let totalAmount = 0;
            const items = [];
            if (!Array.isArray(data.items)) {
                throw new Error('Items harus berupa array');
            }
            for (const itemData of data.items) {
                if (!itemData.productId || !itemData.quantity || !itemData.unitPrice) {
                    throw new Error('Data item tidak lengkap');
                }
                const product = yield this.productRepository.findOne({ where: { id: itemData.productId } });
                if (!product)
                    throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);
                const item = new PurchaseReceiptItem_1.PurchaseReceiptItem();
                item.purchaseReceipt = savedReceipt;
                item.product = product;
                item.quantity = Number(itemData.quantity);
                item.unitPrice = Number(itemData.unitPrice);
                item.subtotal = item.quantity * item.unitPrice;
                totalAmount += item.subtotal;
                items.push(item);
            }
            yield this.purchaseReceiptItemRepository.save(items);
            savedReceipt.totalAmount = totalAmount;
            return yield this.purchaseReceiptRepository.save(savedReceipt);
        });
    }
    getReceipts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.purchaseReceiptRepository.find({
                relations: ['purchaseOrder', 'purchaseOrder.supplier', 'branch', 'items', 'items.product'],
                order: { createdAt: 'DESC' }
            });
        });
    }
    getReceiptById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.purchaseReceiptRepository.findOne({
                where: { id },
                relations: ['purchaseOrder', 'purchaseOrder.supplier', 'branch', 'items', 'items.product']
            });
            if (!receipt)
                throw new Error('Purchase Receipt tidak ditemukan');
            return receipt;
        });
    }
    updateReceipt(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.purchaseReceiptRepository.findOne({
                where: { id },
                relations: ['items']
            });
            if (!receipt)
                throw new Error('Purchase Receipt tidak ditemukan');
            if (receipt.status !== PurchaseReceipt_1.PurchaseReceiptStatus.DRAFT) {
                throw new Error('Hanya bisa mengubah Purchase Receipt dengan status DRAFT');
            }
            if (data.receiptDate)
                receipt.receiptDate = data.receiptDate;
            if (data.notes)
                receipt.notes = data.notes;
            if (data.items) {
                yield this.purchaseReceiptItemRepository.remove(receipt.items);
                let totalAmount = 0;
                const items = [];
                for (const itemData of data.items) {
                    const product = yield this.productRepository.findOne({ where: { id: itemData.productId } });
                    if (!product)
                        throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);
                    const item = new PurchaseReceiptItem_1.PurchaseReceiptItem();
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
            return yield this.purchaseReceiptRepository.save(receipt);
        });
    }
    deleteReceipt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.purchaseReceiptRepository.findOne({ where: { id } });
            if (!receipt)
                throw new Error('Purchase Receipt tidak ditemukan');
            if (receipt.status !== PurchaseReceipt_1.PurchaseReceiptStatus.DRAFT) {
                throw new Error('Hanya bisa menghapus Purchase Receipt dengan status DRAFT');
            }
            yield this.purchaseReceiptRepository.remove(receipt);
        });
    }
    updateReceiptStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.purchaseReceiptRepository.findOne({ where: { id } });
            if (!receipt)
                throw new Error('Purchase Receipt tidak ditemukan');
            receipt.status = status;
            return yield this.purchaseReceiptRepository.save(receipt);
        });
    }
    filterReceipts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield query.getMany();
        });
    }
}
exports.PurchaseReceiptService = PurchaseReceiptService;
