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
exports.StockAdjustmentService = void 0;
const data_source_1 = require("../data-source");
const StockAdjustment_1 = require("../entity/StockAdjustment");
const StockService_1 = require("./StockService");
const StockMutation_1 = require("../entity/StockMutation");
const Product_1 = require("../entity/Product");
const User_1 = require("../entity/User");
class StockAdjustmentService {
    static adjustStock(productId, actualQty, userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const adjustmentRepo = data_source_1.AppDataSource.getRepository(StockAdjustment_1.StockAdjustment);
            const mutationRepo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            const product = yield productRepo.findOneByOrFail({ id: productId });
            const user = yield userRepo.findOneByOrFail({ id: userId });
            const systemQty = yield StockService_1.StockService.getCurrentStock(productId);
            const diff = actualQty - systemQty;
            if (diff === 0)
                return { message: "No adjustment needed" };
            yield adjustmentRepo.save({
                product,
                actualStock: actualQty,
                systemStock: systemQty,
                difference: diff,
                reason,
                adjustedBy: user,
            });
            yield mutationRepo.save({
                product,
                quantity: Math.abs(diff),
                type: diff > 0 ? "IN" : "OUT",
                reference: `ADJUSTMENT-${Date.now()}`,
                date: new Date(),
            });
            return { message: "Stock adjusted", difference: diff };
        });
    }
    static getAdjustments() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockAdjustment_1.StockAdjustment);
            return yield repo.find({ order: { adjustedAt: "DESC" } });
        });
    }
    static approveAdjustment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockAdjustment_1.StockAdjustment);
            const adjustment = yield repo.findOneByOrFail({ id });
            if (adjustment.status === 'APPROVED') {
                throw new Error('Adjustment already approved');
            }
            adjustment.status = 'APPROVED';
            return yield repo.save(adjustment);
        });
    }
}
exports.StockAdjustmentService = StockAdjustmentService;
