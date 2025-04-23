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
exports.StockAdjustmentController = void 0;
const StockAdjustmentService_1 = require("../services/StockAdjustmentService");
class StockAdjustmentController {
    static adjustStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, actualQty, reason } = req.body;
                if (!req.user)
                    return res.status(401).json({ message: "Unauthorized" });
                const userId = req.user.id;
                const result = yield StockAdjustmentService_1.StockAdjustmentService.adjustStock(productId, actualQty, userId, reason);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to adjust stock", error });
            }
        });
    }
    static listAdjustments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield StockAdjustmentService_1.StockAdjustmentService.getAdjustments();
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to list adjustments", error });
            }
        });
    }
    static approve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const result = yield StockAdjustmentService_1.StockAdjustmentService.approveAdjustment(id);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to approve adjustment", error });
            }
        });
    }
}
exports.StockAdjustmentController = StockAdjustmentController;
