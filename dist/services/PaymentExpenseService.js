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
exports.PaymentExpenseService = void 0;
const data_source_1 = require("../data-source");
const PaymentExpense_1 = require("../entity/PaymentExpense");
const JournalHelper_1 = require("../utils/JournalHelper");
const repo = data_source_1.AppDataSource.getRepository(PaymentExpense_1.PaymentExpense);
class PaymentExpenseService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const payment = repo.create(data);
            yield repo.save(payment);
            yield JournalHelper_1.JournalHelper.createJournal({
                reference: `PAY-${payment.paymentNumber}`,
                description: `Pembayaran ke ${payment.supplier.name}`,
                entries: [
                    {
                        accountId: ((_a = payment.invoice.payableAccount) === null || _a === void 0 ? void 0 : _a.id) || 201,
                        debit: payment.amount,
                        credit: 0,
                    },
                    {
                        accountId: payment.cashAccount.id,
                        debit: 0,
                        credit: payment.amount,
                    },
                ],
            });
            return payment;
        });
    }
}
exports.PaymentExpenseService = PaymentExpenseService;
