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
exports.StockAlertService = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const StockService_1 = require("./StockService");
class StockAlertService {
    static getLowStockProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const products = yield productRepo.find();
            const alerts = [];
            for (const product of products) {
                const currentStock = yield StockService_1.StockService.getCurrentStock(product.id);
                if (currentStock < product.minimumStock) {
                    alerts.push({
                        productId: product.id,
                        productName: product.name,
                        currentStock,
                        minimumStock: product.minimumStock,
                        suggestedQty: product.minimumStock - currentStock,
                    });
                }
            }
            return alerts;
        });
    }
}
exports.StockAlertService = StockAlertService;
