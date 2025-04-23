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
exports.AutoPurchaseOrderService = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const StockService_1 = require("./StockService");
const PurchaseInvoice_1 = require("../entity/PurchaseInvoice");
const PurchaseInvoiceItem_1 = require("../entity/PurchaseInvoiceItem");
const Supplier_1 = require("../entity/Supplier");
const PurchaseInvoice_2 = require("../entity/PurchaseInvoice");
class AutoPurchaseOrderService {
    static generateDraftPurchaseOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const products = yield productRepo.find();
            const draftPOs = {};
            for (const product of products) {
                const stock = yield StockService_1.StockService.getCurrentStock(product.id);
                if (stock < product.minimumStock && product.defaultSupplier) {
                    const suggestedQty = product.minimumStock - stock;
                    const supplierId = product.defaultSupplier.id;
                    if (!draftPOs[supplierId]) {
                        draftPOs[supplierId] = [];
                    }
                    draftPOs[supplierId].push({
                        productId: product.id,
                        productName: product.name,
                        qty: suggestedQty,
                    });
                }
            }
            const result = Object.entries(draftPOs).map(([supplierId, items]) => ({
                supplierId: +supplierId,
                supplierName: items[0].productName.defaultSupplier.name,
                items,
            }));
            return result;
        });
    }
    static createPOFromDraft(supplierId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplierRepo = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const purchaseRepo = data_source_1.AppDataSource.getRepository(PurchaseInvoice_1.PurchaseInvoice);
            const itemRepo = data_source_1.AppDataSource.getRepository(PurchaseInvoiceItem_1.PurchaseInvoiceItem);
            const supplier = yield supplierRepo.findOneByOrFail({ id: supplierId });
            const po = yield purchaseRepo.save({
                supplier,
                invoiceNumber: `PO-${Date.now()}`,
                invoiceDate: new Date(),
                dueDate: new Date(),
                totalAmount: 0,
                status: PurchaseInvoice_2.PurchaseInvoiceStatus.UNPAID,
                subtotal: 0,
                taxAmount: 0,
                paidAmount: 0,
                remainingAmount: 0,
                isPpn: false,
                isPph: false,
                ppnRate: 0,
                pphRate: 0
            });
            let total = 0;
            for (const entry of items) {
                const product = yield productRepo.findOneByOrFail({ id: entry.productId });
                const unitPrice = product.cost || 0;
                const subtotal = unitPrice * entry.qty;
                total += subtotal;
                yield itemRepo.save({
                    purchaseInvoice: po,
                    product,
                    quantity: entry.qty,
                    unitPrice,
                    subtotal,
                    discount: 0,
                    taxAmount: 0,
                    total: subtotal
                });
            }
            po.totalAmount = total;
            yield purchaseRepo.save(po);
            return { message: "Draft PO created", purchaseId: po.id };
        });
    }
}
exports.AutoPurchaseOrderService = AutoPurchaseOrderService;
