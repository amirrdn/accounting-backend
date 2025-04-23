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
exports.ProductionService = void 0;
const data_source_1 = require("../data-source");
const ProductionOrder_1 = require("../entity/ProductionOrder");
const BillOfMaterial_1 = require("../entity/BillOfMaterial");
const StockService_1 = require("./StockService");
class ProductionService {
    static createProductionOrder(productId, quantity, warehouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bomRepo = data_source_1.AppDataSource.getRepository(BillOfMaterial_1.BillOfMaterial);
            const productionRepo = data_source_1.AppDataSource.getRepository(ProductionOrder_1.ProductionOrder);
            const bom = yield bomRepo.findOne({
                where: { product: { id: productId } },
                relations: ["items", "items.material"]
            });
            if (!bom)
                throw new Error("BOM tidak ditemukan");
            const order = productionRepo.create({
                product: { id: productId },
                quantity,
                warehouse: { id: warehouseId },
                status: "COMPLETED"
            });
            yield productionRepo.save(order);
            for (const item of bom.items) {
                const totalQty = item.quantity * quantity;
                yield StockService_1.StockService.adjustStock(item.material.id, warehouseId, -totalQty);
            }
            yield StockService_1.StockService.adjustStock(productId, warehouseId, quantity);
            return order;
        });
    }
}
exports.ProductionService = ProductionService;
