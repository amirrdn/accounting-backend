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
exports.PurchasePaymentController = void 0;
const PurchasePaymentService_1 = require("../services/PurchasePaymentService");
class PurchasePaymentController {
    constructor() {
        this.paymentService = new PurchasePaymentService_1.PurchasePaymentService();
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, search, startDate, endDate } = req.query;
                const result = yield this.paymentService.findAll({
                    page: page ? parseInt(page) : undefined,
                    limit: limit ? parseInt(limit) : undefined,
                    search: search,
                    startDate: startDate,
                    endDate: endDate
                });
                res.json(result);
            }
            catch (error) {
                res.status(500).json({
                    message: "Terjadi kesalahan saat mengambil data pembayaran",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const payment = yield this.paymentService.findById(Number(id));
                if (!payment) {
                    res.status(404).json({
                        message: "Data pembayaran tidak ditemukan"
                    });
                    return;
                }
                res.json(payment);
            }
            catch (error) {
                res.status(500).json({
                    message: "Terjadi kesalahan saat mengambil data pembayaran",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield this.paymentService.create(req.body);
                res.status(201).json({
                    status: "success",
                    data: payment
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "PURCHASE_PAYMENT_CREATE_ERROR",
                    message: "Terjadi kesalahan saat membuat pembayaran",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const payment = yield this.paymentService.update(Number(id), req.body);
                res.json(payment);
            }
            catch (error) {
                res.status(400).json({
                    message: "Terjadi kesalahan saat mengupdate pembayaran",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.paymentService.delete(Number(id));
                res.json({
                    message: "Pembayaran berhasil dihapus"
                });
            }
            catch (error) {
                res.status(400).json({
                    message: "Terjadi kesalahan saat menghapus pembayaran",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    getUnpaidInvoices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { supplierId } = req.params;
                const invoices = yield this.paymentService.getUnpaidInvoices(parseInt(supplierId));
                res.json(invoices);
            }
            catch (error) {
                res.status(500).json({
                    message: "Terjadi kesalahan saat mengambil daftar invoice",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    generatePaymentNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const number = yield this.paymentService.generatePaymentNumber();
                res.json({ number });
            }
            catch (error) {
                res.status(500).json({
                    message: "Terjadi kesalahan saat generate nomor pembayaran",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
}
exports.PurchasePaymentController = PurchasePaymentController;
