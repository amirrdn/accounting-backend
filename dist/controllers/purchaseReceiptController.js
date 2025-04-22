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
exports.PurchaseReceiptController = void 0;
const purchaseReceiptService_1 = require("../services/purchaseReceiptService");
class PurchaseReceiptController {
    constructor() {
        this.purchaseReceiptService = new purchaseReceiptService_1.PurchaseReceiptService();
    }
    createReceipt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.purchaseOrderId || !data.branchId || !data.receiptDate || !data.items) {
                    throw new Error('Data tidak lengkap');
                }
                const receipt = yield this.purchaseReceiptService.createReceipt(data);
                res.status(201).json(receipt);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReceipts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipts = yield this.purchaseReceiptService.getReceipts();
                res.json(receipts);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReceiptById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipt = yield this.purchaseReceiptService.getReceiptById(req.params.id);
                res.json(receipt);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReceipt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipt = yield this.purchaseReceiptService.updateReceipt(req.params.id, req.body);
                res.json(receipt);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteReceipt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.purchaseReceiptService.deleteReceipt(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReceiptStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipt = yield this.purchaseReceiptService.updateReceiptStatus(req.params.id, req.body.status);
                res.json(receipt);
            }
            catch (error) {
                next(error);
            }
        });
    }
    filterReceipts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {
                    startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                    endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                    branchId: req.query.branchId ? Number(req.query.branchId) : undefined,
                    supplierId: req.query.supplierId ? Number(req.query.supplierId) : undefined,
                    status: req.query.status ? req.query.status : undefined
                };
                const receipts = yield this.purchaseReceiptService.filterReceipts(filters);
                res.json(receipts);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PurchaseReceiptController = PurchaseReceiptController;
