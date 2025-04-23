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
exports.AutoPurchaseOrderController = void 0;
const AutoPurchaseOrderService_1 = require("../services/AutoPurchaseOrderService");
class AutoPurchaseOrderController {
    static getDraftPO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield AutoPurchaseOrderService_1.AutoPurchaseOrderService.generateDraftPurchaseOrder();
                res.json(data);
            }
            catch (err) {
                res.status(500).json({ message: "Gagal generate draft PO", error: err });
            }
        });
    }
    static createPO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { supplierId, items } = req.body;
                const result = yield AutoPurchaseOrderService_1.AutoPurchaseOrderService.createPOFromDraft(supplierId, items);
                res.json(result);
            }
            catch (err) {
                res.status(500).json({ message: "Gagal membuat PO dari draft", error: err });
            }
        });
    }
}
exports.AutoPurchaseOrderController = AutoPurchaseOrderController;
