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
exports.StockTransferController = void 0;
const StockTransferService_1 = require("../services/StockTransferService");
const ExportHelper_1 = require("../utils/ExportHelper");
const StockTransfer_1 = require("../entity/StockTransfer");
const data_source_1 = require("../data-source");
class StockTransferController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield StockTransferService_1.StockTransferService.createTransfer(req.body);
                res.json(result);
            }
            catch (err) {
                res.status(500).json({ message: "Gagal membuat transfer", error: err });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield StockTransferService_1.StockTransferService.getAllTransfers();
                res.json(data);
            }
            catch (err) {
                res.status(500).json({ message: "Gagal mengambil data transfer", error: err });
            }
        });
    }
    static exportPDF(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfer = yield data_source_1.AppDataSource.getRepository(StockTransfer_1.StockTransfer).findOne({
                where: { id: +req.params.id },
                relations: ["fromWarehouse", "toWarehouse", "items", "items.product"],
            });
            if (!transfer)
                return res.status(404).json({ message: "Transfer tidak ditemukan" });
            return ExportHelper_1.ExportHelper.generateTransferPDF(transfer, res);
        });
    }
    static exportExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfer = yield data_source_1.AppDataSource.getRepository(StockTransfer_1.StockTransfer).findOne({
                where: { id: +req.params.id },
                relations: ["fromWarehouse", "toWarehouse", "items", "items.product"],
            });
            if (!transfer)
                return res.status(404).json({ message: "Transfer tidak ditemukan" });
            return ExportHelper_1.ExportHelper.generateTransferExcel(transfer, res);
        });
    }
    static receiveTransfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield StockTransferService_1.StockTransferService.markAsReceived(+req.params.id);
                res.json(result);
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
}
exports.StockTransferController = StockTransferController;
