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
exports.PettyCashController = void 0;
const PettyCashService_1 = require("../services/PettyCashService");
class PettyCashController {
    constructor() {
        this.pettyCashService = new PettyCashService_1.PettyCashService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionDate, description, amount, type, receiptNumber, attachmentUrl } = req.body;
                const requestedBy = req.user;
                const pettyCash = yield this.pettyCashService.create({
                    transactionDate: new Date(transactionDate),
                    description,
                    amount,
                    type,
                    receiptNumber,
                    attachmentUrl,
                    requestedBy
                });
                return res.status(201).json(pettyCash);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, type, startDate, endDate } = req.query;
                const pettyCashList = yield this.pettyCashService.findAll({
                    status: status,
                    type: type,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined
                });
                return res.json(pettyCashList);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const pettyCash = yield this.pettyCashService.findById(Number(id));
                if (!pettyCash) {
                    return res.status(404).json({ message: "Petty cash not found" });
                }
                return res.json(pettyCash);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    approve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const approver = req.user;
                const pettyCash = yield this.pettyCashService.approve(Number(id), approver);
                return res.json(pettyCash);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    reject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const approver = req.user;
                const pettyCash = yield this.pettyCashService.reject(Number(id), approver);
                return res.json(pettyCash);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    getBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.pettyCashService.getBalance();
                return res.json({
                    status: "success",
                    data: { balance }
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: "error",
                    code: "PETTY_CASH_GET_BALANCE_ERROR",
                    message: "Terjadi kesalahan saat mengambil saldo petty cash"
                });
            }
        });
    }
}
exports.PettyCashController = PettyCashController;
