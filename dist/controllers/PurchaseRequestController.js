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
exports.PurchaseRequestController = void 0;
const PurchaseRequestService_1 = require("../services/PurchaseRequestService");
const PurchaseRequest_1 = require("../entity/PurchaseRequest");
class PurchaseRequestController {
    constructor() {
        this.service = new PurchaseRequestService_1.PurchaseRequestService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const dto = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                if (typeof dto.branchId === 'string') {
                    dto.branchId = parseInt(dto.branchId);
                }
                const user = yield this.service.findUserById(userId);
                const result = yield this.service.create(dto, user);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: (error === null || error === void 0 ? void 0 : error.message) || 'Error creating purchase request' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const dto = req.body;
                if (dto.branchId && typeof dto.branchId === 'string') {
                    dto.branchId = parseInt(dto.branchId);
                }
                const result = yield this.service.update(id, dto);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: (error === null || error === void 0 ? void 0 : error.message) || 'Error updating purchase request' });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.service.findOne(id);
                if (!result) {
                    return res.status(404).json({ message: "Purchase request not found" });
                }
                res.json(result);
            }
            catch (error) {
                res.status(404).json({ message: (error === null || error === void 0 ? void 0 : error.message) || "Purchase request not found" });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.findAll();
                res.json({
                    status: "success",
                    data: result
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "PURCHASE_REQUEST_GET_ALL_ERROR",
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Terjadi kesalahan saat mengambil data purchase request"
                });
            }
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.service.findOne(id);
                res.json({
                    status: "success",
                    data: result
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "PURCHASE_REQUEST_GET_ONE_ERROR",
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Terjadi kesalahan saat mengambil data purchase request"
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.service.delete(id);
                res.json({
                    status: "success",
                    message: "Purchase request berhasil dihapus"
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "PURCHASE_REQUEST_DELETE_ERROR",
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Terjadi kesalahan saat menghapus purchase request"
                });
            }
        });
    }
    approve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = req.params.id;
                const { approvalNotes, approvalDate, budgetCheck, stockCheck, supplierCheck, products, warehouseId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error('User not authenticated');
                }
                const result = yield this.service.update(id, {
                    status: PurchaseRequest_1.PurchaseRequestStatus.APPROVED,
                    approvalNotes,
                    approvalDate: new Date(approvalDate),
                    budgetCheck,
                    stockCheck,
                    supplierCheck,
                    approvedBy: { id: userId.toString() },
                    products,
                    warehouseId
                });
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: (error === null || error === void 0 ? void 0 : error.message) || 'Error approving purchase request' });
            }
        });
    }
    reject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = req.params.id;
                const { rejectionNotes, rejectionDate, rejectionReason, warehouseId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error('User not authenticated');
                }
                const result = yield this.service.update(id, {
                    status: PurchaseRequest_1.PurchaseRequestStatus.REJECTED,
                    rejectionNotes,
                    rejectionDate: new Date(rejectionDate),
                    rejectionReason,
                    rejectedBy: { id: userId.toString() },
                    warehouseId
                });
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: (error === null || error === void 0 ? void 0 : error.message) || 'Error rejecting purchase request' });
            }
        });
    }
}
exports.PurchaseRequestController = PurchaseRequestController;
