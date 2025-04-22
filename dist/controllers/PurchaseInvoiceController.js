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
exports.PurchaseInvoiceController = void 0;
const PurchaseInvoiceService_1 = require("../services/PurchaseInvoiceService");
class PurchaseInvoiceController {
    constructor() {
        this.purchaseInvoiceService = new PurchaseInvoiceService_1.PurchaseInvoiceService();
    }
    createPurchaseInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const purchaseInvoice = yield this.purchaseInvoiceService.createPurchaseInvoice(req.body, file);
                res.status(201).json(purchaseInvoice);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updatePurchaseInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const file = req.file;
                const purchaseInvoice = yield this.purchaseInvoiceService.updatePurchaseInvoice(Number(id), req.body, file);
                res.json(purchaseInvoice);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getPurchaseInvoices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.purchaseInvoiceService) {
                    this.purchaseInvoiceService = new PurchaseInvoiceService_1.PurchaseInvoiceService();
                }
                const purchaseInvoices = yield this.purchaseInvoiceService.getAll();
                res.json(purchaseInvoices);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({
                        status: 500,
                        message: "Error saat mengambil data invoice: " + error.message
                    });
                }
                else {
                    res.status(500).json({
                        status: 500,
                        message: "Terjadi kesalahan saat mengambil data invoice"
                    });
                }
            }
        });
    }
    getPurchaseInvoiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const purchaseInvoice = yield this.purchaseInvoiceService.getById(Number(id));
                res.json(purchaseInvoice);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updatePurchaseInvoiceStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const purchaseInvoice = yield this.purchaseInvoiceService.updatePurchaseInvoiceStatus(Number(id), status);
                res.json(purchaseInvoice);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deletePurchaseInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.purchaseInvoiceService.delete(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.PurchaseInvoiceController = PurchaseInvoiceController;
