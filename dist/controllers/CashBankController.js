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
exports.CashBankController = void 0;
const CashBankService_1 = require("../services/CashBankService");
class CashBankController {
    static transfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sourceId, destinationAccountId, amount, description, branchId, date } = req.body;
                const result = yield CashBankService_1.CashBankService.transfer(sourceId, destinationAccountId, amount, description, branchId, date);
                res.json(result);
            }
            catch (error) {
                if (error.message === 'Saldo tidak cukup untuk transfer') {
                    res.status(400).json({ message: 'Saldo tidak cukup untuk transfer' });
                }
                else if (error.message === 'Akun sumber dan tujuan tidak boleh sama') {
                    res.status(400).json({ message: 'Akun sumber dan tujuan tidak boleh sama' });
                }
                else {
                    res.status(500).json({ message: 'Terjadi kesalahan saat melakukan transfer' });
                }
            }
        });
    }
    static cashIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId, amount, description, branchId, destinationAccountId } = req.body;
            const result = yield CashBankService_1.CashBankService.cashIn(accountId, amount, description, branchId, destinationAccountId);
            res.json(result);
        });
    }
    static cashOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId, amount, description, branchId, destinationAccountId, date } = req.body;
            const result = yield CashBankService_1.CashBankService.cashOut(accountId, amount, description, branchId, destinationAccountId, date);
            res.json(result);
        });
    }
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield CashBankService_1.CashBankService.listTransactions();
            res.json(data);
        });
    }
    static cashFlow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(req.query.start);
            const end = new Date(req.query.end);
            const result = yield CashBankService_1.CashBankService.getCashFlow(start, end);
            res.json(result);
        });
    }
    static approve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const result = yield CashBankService_1.CashBankService.approve(id);
            res.json(result);
        });
    }
}
exports.CashBankController = CashBankController;
