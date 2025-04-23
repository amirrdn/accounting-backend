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
exports.PurchaseInvoiceService = void 0;
const PurchaseInvoice_1 = require("../entity/PurchaseInvoice");
const PurchaseInvoiceItem_1 = require("../entity/PurchaseInvoiceItem");
const data_source_1 = require("../data-source");
const JournalHelper_1 = require("../utils/JournalHelper");
const Product_1 = require("../entity/Product");
const Supplier_1 = require("../entity/Supplier");
const Branch_1 = require("../entity/Branch");
const Account_1 = require("../entity/Account");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typeorm_1 = require("typeorm");
class PurchaseInvoiceService {
    constructor() {
        this.purchaseInvoiceRepository = data_source_1.AppDataSource.getRepository(PurchaseInvoice_1.PurchaseInvoice);
        this.purchaseInvoiceItemRepository = data_source_1.AppDataSource.getRepository(PurchaseInvoiceItem_1.PurchaseInvoiceItem);
        this.productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        this.supplierRepository = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
        this.branchRepository = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
        this.accountRepository = data_source_1.AppDataSource.getRepository(Account_1.Account);
        this.uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    generateInvoiceNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const lastInvoice = yield this.purchaseInvoiceRepository.findOne({
                where: {
                    invoiceNumber: (0, typeorm_1.Like)(`INV-${year}${month}-%`)
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
        });
    }
    saveFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);
            yield fs.promises.writeFile(filePath, file.buffer);
            return `/uploads/${fileName}`;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const invoiceNumber = yield this.generateInvoiceNumber();
                const purchaseInvoice = this.purchaseInvoiceRepository.create(Object.assign(Object.assign({}, dto), { invoiceNumber, status: PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID, items: dto.items.map(item => this.purchaseInvoiceItemRepository.create(Object.assign(Object.assign({}, item), { subtotal: item.quantity * item.unitPrice, total: (item.quantity * item.unitPrice) - (item.discount || 0) }))), paidAmount: 0, remainingAmount: dto.totalAmount }));
                yield queryRunner.manager.save(purchaseInvoice);
                yield JournalHelper_1.JournalHelper.createJournal({
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
                yield queryRunner.commitTransaction();
                return purchaseInvoice;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const purchaseInvoice = yield this.getById(id);
                if (!purchaseInvoice) {
                    throw new Error("Purchase invoice not found");
                }
                if (data.paidAmount !== undefined) {
                    const remainingAmount = purchaseInvoice.totalAmount - data.paidAmount;
                    if (remainingAmount <= 0) {
                        data.status = PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_FULL;
                    }
                    else if (data.paidAmount > 0) {
                        data.status = PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_PARTIAL;
                    }
                    data.remainingAmount = remainingAmount;
                }
                yield queryRunner.manager.update(PurchaseInvoice_1.PurchaseInvoice, id, data);
                yield queryRunner.commitTransaction();
                return this.getById(id);
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.purchaseInvoiceRepository.delete(id);
        });
    }
    createPurchaseInvoice(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceData = typeof data === 'string' ? JSON.parse(data) : data;
            const supplier = yield this.supplierRepository.findOne({ where: { id: invoiceData.supplierId } });
            if (!supplier)
                throw new Error("Supplier tidak ditemukan");
            const branch = yield this.branchRepository.findOne({ where: { id: invoiceData.branchId } });
            if (!branch)
                throw new Error("Cabang tidak ditemukan");
            const payableAccount = yield this.accountRepository.findOne({ where: { id: invoiceData.payableAccountId } });
            if (!payableAccount)
                throw new Error("Akun hutang tidak ditemukan");
            const invoiceNumber = yield this.generateInvoiceNumber();
            const purchaseInvoice = new PurchaseInvoice_1.PurchaseInvoice();
            purchaseInvoice.invoiceNumber = invoiceNumber;
            purchaseInvoice.invoiceDate = new Date(invoiceData.invoiceDate);
            purchaseInvoice.dueDate = new Date(invoiceData.dueDate);
            purchaseInvoice.supplier = supplier;
            purchaseInvoice.branch = branch;
            purchaseInvoice.payableAccount = payableAccount;
            purchaseInvoice.status = PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID;
            purchaseInvoice.notes = invoiceData.notes || "";
            purchaseInvoice.isPpn = invoiceData.isPpn || false;
            purchaseInvoice.isPph = invoiceData.isPph || false;
            purchaseInvoice.ppnRate = invoiceData.ppnRate || 0;
            purchaseInvoice.pphRate = invoiceData.pphRate || 0;
            purchaseInvoice.attachmentUrl = file ? yield this.saveFile(file) : "";
            let subtotal = 0;
            const items = [];
            for (const itemData of invoiceData.items) {
                const product = yield this.productRepository.findOne({ where: { id: itemData.productId } });
                if (!product)
                    throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);
                const item = new PurchaseInvoiceItem_1.PurchaseInvoiceItem();
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
            const savedPurchaseInvoice = yield this.purchaseInvoiceRepository.save(purchaseInvoice);
            for (const item of items) {
                item.purchaseInvoice = savedPurchaseInvoice;
                yield this.purchaseInvoiceItemRepository.save(item);
            }
            return savedPurchaseInvoice;
        });
    }
    updatePurchaseInvoice(id, data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseInvoice = yield this.purchaseInvoiceRepository.findOne({ where: { id } });
            if (!purchaseInvoice)
                throw new Error("Invoice tidak ditemukan");
            if (purchaseInvoice.status !== PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID) {
                throw new Error("Hanya Invoice dengan status UNPAID yang dapat diupdate");
            }
            const supplier = yield this.supplierRepository.findOne({ where: { id: data.supplierId } });
            if (!supplier)
                throw new Error("Supplier tidak ditemukan");
            const branch = yield this.branchRepository.findOne({ where: { id: data.branchId } });
            if (!branch)
                throw new Error("Cabang tidak ditemukan");
            const payableAccount = yield this.accountRepository.findOne({ where: { id: data.payableAccountId } });
            if (!payableAccount)
                throw new Error("Akun hutang tidak ditemukan");
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
                        yield fs.promises.unlink(oldFilePath);
                    }
                }
                purchaseInvoice.attachmentUrl = yield this.saveFile(file);
            }
            yield this.purchaseInvoiceItemRepository.delete({ purchaseInvoice: { id } });
            let subtotal = 0;
            const items = [];
            for (const itemData of data.items) {
                const product = yield this.productRepository.findOne({ where: { id: itemData.productId } });
                if (!product)
                    throw new Error(`Produk dengan ID ${itemData.productId} tidak ditemukan`);
                const item = new PurchaseInvoiceItem_1.PurchaseInvoiceItem();
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
            return yield this.purchaseInvoiceRepository.save(purchaseInvoice);
        });
    }
    getPurchaseInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.purchaseInvoiceRepository.find({
                relations: ["supplier", "branch", "payableAccount", "items", "items.product"],
                order: { createdAt: "DESC" }
            });
        });
    }
    getPurchaseInvoiceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseInvoice = yield this.purchaseInvoiceRepository.findOne({
                where: { id },
                relations: ["supplier", "branch", "payableAccount", "items", "items.product"]
            });
            if (!purchaseInvoice)
                throw new Error("Invoice tidak ditemukan");
            return purchaseInvoice;
        });
    }
    updatePurchaseInvoiceStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseInvoice = yield this.purchaseInvoiceRepository.findOne({ where: { id } });
            if (!purchaseInvoice)
                throw new Error("Invoice tidak ditemukan");
            purchaseInvoice.status = status;
            return yield this.purchaseInvoiceRepository.save(purchaseInvoice);
        });
    }
    deletePurchaseInvoice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseInvoice = yield this.purchaseInvoiceRepository.findOne({ where: { id } });
            if (!purchaseInvoice)
                throw new Error("Invoice tidak ditemukan");
            if (purchaseInvoice.status !== PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID) {
                throw new Error("Hanya Invoice dengan status UNPAID yang dapat dihapus");
            }
            if (purchaseInvoice.attachmentUrl) {
                const filePath = path.join(__dirname, '../..', purchaseInvoice.attachmentUrl);
                if (fs.existsSync(filePath)) {
                    yield fs.promises.unlink(filePath);
                }
            }
            return yield this.purchaseInvoiceRepository.remove(purchaseInvoice);
        });
    }
}
exports.PurchaseInvoiceService = PurchaseInvoiceService;
