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
exports.InventoryReportService = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const StockMutation_1 = require("../entity/StockMutation");
const PurchaseInvoiceItem_1 = require("../entity/PurchaseInvoiceItem");
class InventoryReportService {
    static getInventoryValueReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const mutationRepo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            const purchaseItemRepo = data_source_1.AppDataSource.getRepository(PurchaseInvoiceItem_1.PurchaseInvoiceItem);
            const products = yield productRepo.find();
            const results = [];
            for (const product of products) {
                const mutations = yield mutationRepo.find({
                    where: { product: { id: product.id } },
                });
                const stock = mutations.reduce((sum, m) => {
                    return sum + (m.type === "IN" ? m.quantity : -m.quantity);
                }, 0);
                if (stock === 0)
                    continue;
                const lastPurchaseItem = yield purchaseItemRepo.findOne({
                    where: { product: { id: product.id } },
                    order: { id: "DESC" },
                    relations: ["purchaseInvoice"],
                });
                const lastPrice = (lastPurchaseItem === null || lastPurchaseItem === void 0 ? void 0 : lastPurchaseItem.unitPrice) || 0;
                results.push({
                    productId: product.id,
                    productName: product.name,
                    stock,
                    lastPurchasePrice: lastPrice,
                    inventoryValue: stock * lastPrice,
                });
            }
            return results;
        });
    }
}
exports.InventoryReportService = InventoryReportService;
