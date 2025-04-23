"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.PurchaseOrderService = void 0;
const data_source_1 = require("../data-source");
const PurchaseOrder_1 = require("../entity/PurchaseOrder");
const PurchaseOrderItem_1 = require("../entity/PurchaseOrderItem");
const Product_1 = require("../entity/Product");
const Supplier_1 = require("../entity/Supplier");
const Branch_1 = require("../entity/Branch");
const PurchaseOrder_2 = require("../entity/PurchaseOrder");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const User_1 = require("../entity/User");
class PurchaseOrderService {
    constructor() {
        this.purchaseOrderRepository = data_source_1.AppDataSource.getRepository(PurchaseOrder_1.PurchaseOrder);
        this.purchaseOrderItemRepository = data_source_1.AppDataSource.getRepository(PurchaseOrderItem_1.PurchaseOrderItem);
        this.productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        this.supplierRepository = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
        this.branchRepository = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
        this.uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    saveFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);
            yield fs.promises.writeFile(filePath, file.buffer);
            return `/uploads/${fileName}`;
        });
    }
    createPurchaseOrder(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const poData = typeof data === 'string' ? JSON.parse(data) : data;
            const supplier = yield this.supplierRepository.findOne({ where: { id: poData.supplierId } });
            if (!supplier)
                throw new Error("Supplier tidak ditemukan");
            const branch = yield this.branchRepository.findOne({ where: { id: poData.branchId } });
            if (!branch)
                throw new Error("Cabang tidak ditemukan");
            const purchaseOrder = new PurchaseOrder_1.PurchaseOrder();
            purchaseOrder.poNumber = `PO-${Date.now()}`;
            purchaseOrder.orderDate = new Date(poData.orderDate);
            purchaseOrder.expectedDeliveryDate = new Date(poData.expectedDeliveryDate);
            purchaseOrder.supplier = supplier;
            purchaseOrder.branch = branch;
            purchaseOrder.status = PurchaseOrder_2.PurchaseOrderStatus.DRAFT;
            purchaseOrder.notes = poData.notes || "";
            purchaseOrder.isPpn = poData.isPpn || false;
            purchaseOrder.isPph = poData.isPph || false;
            purchaseOrder.ppnRate = poData.ppnRate || 0;
            purchaseOrder.pphRate = poData.pphRate || 0;
            purchaseOrder.attachmentUrl = file ? yield this.saveFile(file) : "";
            let subtotal = 0;
            const items = [];
            for (const itemData of poData.items) {
                const product = yield this.productRepository.findOne({ where: { id: itemData.productId } });
                if (!product)
                    throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);
                const item = new PurchaseOrderItem_1.PurchaseOrderItem();
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
            const savedPurchaseOrder = yield this.purchaseOrderRepository.save(purchaseOrder);
            for (const item of items) {
                item.purchaseOrder = savedPurchaseOrder;
                yield this.purchaseOrderItemRepository.save(item);
            }
            return savedPurchaseOrder;
        });
    }
    updatePurchaseOrder(id, data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseOrder = yield this.purchaseOrderRepository.findOne({ where: { id } });
            if (!purchaseOrder)
                throw new Error("Purchase Order tidak ditemukan");
            if (purchaseOrder.status !== PurchaseOrder_2.PurchaseOrderStatus.DRAFT) {
                throw new Error("Hanya Purchase Order dengan status DRAFT yang dapat diupdate");
            }
            const supplier = yield this.supplierRepository.findOne({ where: { id: data.supplierId } });
            if (!supplier)
                throw new Error("Supplier tidak ditemukan");
            const branch = yield this.branchRepository.findOne({ where: { id: data.branchId } });
            if (!branch)
                throw new Error("Cabang tidak ditemukan");
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
                        yield fs.promises.unlink(oldFilePath);
                    }
                }
                purchaseOrder.attachmentUrl = yield this.saveFile(file);
            }
            yield this.purchaseOrderItemRepository.delete({ purchaseOrder: { id } });
            let subtotal = 0;
            const items = [];
            for (const itemData of data.items) {
                const product = yield this.productRepository.findOne({ where: { id: itemData.productId } });
                if (!product)
                    throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);
                const item = new PurchaseOrderItem_1.PurchaseOrderItem();
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
            return yield this.purchaseOrderRepository.save(purchaseOrder);
        });
    }
    getPurchaseOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.purchaseOrderRepository.find({
                relations: ["supplier", "branch", "items", "items.product"],
                order: { createdAt: "DESC" }
            });
        });
    }
    getPurchaseOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseOrder = yield this.purchaseOrderRepository.findOne({
                where: { id },
                relations: ["supplier", "branch", "items", "items.product"]
            });
            if (!purchaseOrder)
                throw new Error("Purchase Order tidak ditemukan");
            return purchaseOrder;
        });
    }
    updatePurchaseOrderStatus(id, status, userId, approvalNotes) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseOrder = yield this.purchaseOrderRepository.findOne({ where: { id } });
            if (!purchaseOrder)
                throw new Error("Purchase Order tidak ditemukan");
            if (status === PurchaseOrder_2.PurchaseOrderStatus.APPROVED) {
                if (purchaseOrder.status !== PurchaseOrder_2.PurchaseOrderStatus.DRAFT) {
                    throw new Error("Hanya Purchase Order dengan status DRAFT yang dapat disetujui");
                }
                const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({ where: { id: userId } });
                if (!user)
                    throw new Error("User tidak ditemukan");
                purchaseOrder.approvalNotes = approvalNotes || "";
                purchaseOrder.approvalDate = new Date();
                purchaseOrder.approvedBy = user;
            }
            purchaseOrder.status = status;
            return yield this.purchaseOrderRepository.save(purchaseOrder);
        });
    }
    deletePurchaseOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseOrder = yield this.purchaseOrderRepository.findOne({ where: { id } });
            if (!purchaseOrder)
                throw new Error("Purchase Order tidak ditemukan");
            if (purchaseOrder.status !== PurchaseOrder_2.PurchaseOrderStatus.DRAFT) {
                throw new Error("Hanya Purchase Order dengan status DRAFT yang dapat dihapus");
            }
            if (purchaseOrder.attachmentUrl) {
                const filePath = path.join(__dirname, '../..', purchaseOrder.attachmentUrl);
                if (fs.existsSync(filePath)) {
                    yield fs.promises.unlink(filePath);
                }
            }
            return yield this.purchaseOrderRepository.remove(purchaseOrder);
        });
    }
}
exports.PurchaseOrderService = PurchaseOrderService;
