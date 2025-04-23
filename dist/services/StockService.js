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
exports.StockService = void 0;
const data_source_1 = require("../data-source");
const StockMutation_1 = require("../entity/StockMutation");
const ProductStock_1 = require("../entity/ProductStock");
const Product_1 = require("../entity/Product");
const Warehouse_1 = require("../entity/Warehouse");
const Stock_1 = require("../entity/Stock");
class StockService {
    static createFromPurchaseInvoice(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            for (const item of invoice.items) {
                yield repo.save({
                    product: item.product,
                    quantity: item.quantity,
                    type: "IN",
                    reference: invoice.invoiceNumber,
                    date: invoice.invoiceDate,
                });
            }
        });
    }
    static createFromSalesInvoice(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            for (const item of invoice.items) {
                yield repo.save({
                    product: item.product,
                    quantity: item.quantity,
                    type: "OUT",
                    reference: invoice.invoice_number,
                    date: invoice.date,
                });
            }
        });
    }
    static getCurrentStock(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            const all = yield repo.find({
                where: { product: { id: productId } },
            });
            const total = all.reduce((sum, s) => {
                return sum + (s.type === "IN" ? s.quantity : -s.quantity);
            }, 0);
            return total;
        });
    }
    static getStockCard(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            return yield repo.find({
                where: { product: { id: productId } },
                order: { date: "ASC" },
            });
        });
    }
    static increaseStock(productId, qty, warehouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockRepo = data_source_1.AppDataSource.getRepository(ProductStock_1.ProductStock);
            let stock = yield stockRepo.findOne({
                where: {
                    product: { id: productId },
                    warehouse: { id: warehouseId },
                },
                relations: ["product", "warehouse"],
            });
            if (!stock) {
                const product = yield data_source_1.AppDataSource.getRepository(Product_1.Product).findOneByOrFail({ id: productId });
                const warehouse = yield data_source_1.AppDataSource.getRepository(Warehouse_1.Warehouse).findOneByOrFail({ id: warehouseId });
                stock = stockRepo.create({ product, warehouse, quantity: qty });
            }
            else {
                stock.quantity += qty;
            }
            yield stockRepo.save(stock);
        });
    }
    static decreaseStock(productId, qty, warehouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockRepo = data_source_1.AppDataSource.getRepository(ProductStock_1.ProductStock);
            const stock = yield stockRepo.findOne({
                where: {
                    product: { id: productId },
                    warehouse: { id: warehouseId },
                },
                relations: ["product", "warehouse"],
            });
            if (!stock || stock.quantity < qty) {
                throw new Error("Stok tidak cukup atau belum tersedia");
            }
            stock.quantity -= qty;
            yield stockRepo.save(stock);
        });
    }
    static getStock(productId, warehouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockRepo = data_source_1.AppDataSource.getRepository(ProductStock_1.ProductStock);
            const stock = yield stockRepo.findOne({
                where: {
                    product: { id: productId },
                    warehouse: { id: warehouseId },
                },
                relations: ["product", "warehouse"],
            });
            return (stock === null || stock === void 0 ? void 0 : stock.quantity) || 0;
        });
    }
    static adjustStock(productId, warehouseId, qtyDiff) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            let stock = yield repo.findOne({
                where: {
                    product: { id: productId },
                    warehouse: { id: warehouseId },
                },
                relations: ["product", "warehouse"],
            });
            if (!stock) {
                stock = repo.create({
                    product: { id: productId },
                    warehouse: { id: warehouseId },
                    quantity: qtyDiff,
                });
            }
            else {
                stock.quantity += qtyDiff;
            }
            yield repo.save(stock);
        });
    }
}
exports.StockService = StockService;
