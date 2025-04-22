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
exports.PurchaseOrderController = void 0;
const purchaseOrderService_1 = require("../services/purchaseOrderService");
const PurchaseOrder_1 = require("../entity/PurchaseOrder");
const purchaseOrderService = new purchaseOrderService_1.PurchaseOrderService();
class PurchaseOrderController {
    createPurchaseOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const data = req.body.data;
                const purchaseOrder = yield purchaseOrderService.createPurchaseOrder(data, file);
                res.status(201).json({
                    success: true,
                    data: purchaseOrder
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    getPurchaseOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseOrders = yield purchaseOrderService.getPurchaseOrders();
                res.status(200).json({
                    status: "success",
                    data: purchaseOrders
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    code: "PURCHASE_ORDER_GET_ALL_ERROR",
                    message: "Terjadi kesalahan saat mengambil data purchase order"
                });
            }
        });
    }
    getPurchaseOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseOrder = yield purchaseOrderService.getPurchaseOrderById(req.params.id);
                res.status(200).json({
                    success: true,
                    data: purchaseOrder
                });
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    updatePurchaseOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { status, approvalNotes } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error("User tidak terautentikasi");
                }
                if (!Object.values(PurchaseOrder_1.PurchaseOrderStatus).includes(status)) {
                    throw new Error("Status tidak valid");
                }
                const purchaseOrder = yield purchaseOrderService.updatePurchaseOrderStatus(req.params.id, status, userId, approvalNotes);
                res.status(200).json({
                    success: true,
                    data: purchaseOrder
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    deletePurchaseOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield purchaseOrderService.deletePurchaseOrder(req.params.id);
                res.status(200).json({
                    success: true,
                    message: "Purchase Order berhasil dihapus"
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
}
exports.PurchaseOrderController = PurchaseOrderController;
