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
exports.AccountService = void 0;
const data_source_1 = require("../data-source");
const Account_1 = require("../entity/Account");
const JournalDetail_1 = require("../entity/JournalDetail");
const CashBankTransaction_1 = require("../entity/CashBankTransaction");
const PaymentReceipt_1 = require("../entity/PaymentReceipt");
const PaymentExpense_1 = require("../entity/PaymentExpense");
const SalesInvoice_1 = require("../entity/SalesInvoice");
const PurchaseInvoice_1 = require("../entity/PurchaseInvoice");
const accountRepo = data_source_1.AppDataSource.getRepository(Account_1.Account);
const journalDetailRepo = data_source_1.AppDataSource.getRepository(JournalDetail_1.JournalDetail);
const cashBankTransactionRepo = data_source_1.AppDataSource.getRepository(CashBankTransaction_1.CashBankTransaction);
const paymentReceiptRepo = data_source_1.AppDataSource.getRepository(PaymentReceipt_1.PaymentReceipt);
const paymentExpenseRepo = data_source_1.AppDataSource.getRepository(PaymentExpense_1.PaymentExpense);
const salesInvoiceRepo = data_source_1.AppDataSource.getRepository(SalesInvoice_1.SalesInvoice);
const purchaseInvoiceRepo = data_source_1.AppDataSource.getRepository(PurchaseInvoice_1.PurchaseInvoice);
class AccountService {
    static getAllNoPaginate() {
        return accountRepo.find({ relations: ["parent"] });
    }
    static getById(id) {
        return accountRepo.findOne({ where: { id }, relations: ["parent"] });
    }
    static create(data) {
        const account = accountRepo.create(data);
        return accountRepo.save(account);
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield accountRepo.update(id, data);
            return accountRepo.findOne({ where: { id } });
        });
    }
    static delete(id) {
        return accountRepo.delete(id);
    }
    static getAll(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [accounts, total] = yield accountRepo.findAndCount({
                relations: {
                    parent: true
                },
                skip: skip,
                take: limit,
                order: {
                    code: "ASC"
                }
            });
            const accountsWithBalance = yield Promise.all(accounts.map((account) => __awaiter(this, void 0, void 0, function* () {
                const journalDetails = yield journalDetailRepo.find({
                    where: { account: { id: account.id } }
                });
                const journalBalance = journalDetails.reduce((sum, detail) => {
                    const debit = Number(detail.debit) || 0;
                    const credit = Number(detail.credit) || 0;
                    return Number((Number(sum) + (debit - credit)).toFixed(2));
                }, 0);
                const cashBankTransactions = yield cashBankTransactionRepo.find({
                    where: [
                        { accountId: account.id },
                        { destinationAccountId: account.id }
                    ]
                });
                const cashBankBalance = cashBankTransactions.reduce((sum, transaction) => {
                    let amount = 0;
                    if (transaction.accountId === account.id) {
                        amount = -Number(transaction.amount) || 0;
                    }
                    else if (transaction.destinationAccountId === account.id) {
                        amount = Number(transaction.amount) || 0;
                    }
                    return Number((Number(sum) + amount).toFixed(2));
                }, 0);
                const paymentReceipts = yield paymentReceiptRepo.find({
                    where: { cashAccount: { id: account.id } }
                }).catch(() => []);
                const paymentReceiptBalance = paymentReceipts.reduce((sum, receipt) => {
                    const amount = Number(receipt.amount) || 0;
                    return Number((Number(sum) + amount).toFixed(2));
                }, 0);
                const paymentExpenses = yield paymentExpenseRepo.find({
                    where: { cashAccount: { id: account.id } }
                }).catch(() => []);
                const paymentExpenseBalance = paymentExpenses.reduce((sum, expense) => {
                    const amount = Number(expense.amount) || 0;
                    return Number((Number(sum) - amount).toFixed(2));
                }, 0);
                const salesInvoices = yield salesInvoiceRepo.find({
                    where: { receivableAccount: { id: account.id } }
                }).catch(() => []);
                const salesInvoiceBalance = salesInvoices.reduce((sum, invoice) => {
                    const total = Number(invoice.total) || 0;
                    return Number((Number(sum) + total).toFixed(2));
                }, 0);
                const purchaseInvoices = yield purchaseInvoiceRepo.find({
                    where: { payableAccount: { id: account.id } }
                }).catch(() => []);
                const purchaseInvoiceBalance = purchaseInvoices.reduce((sum, invoice) => {
                    const totalAmount = Number(invoice.totalAmount) || 0;
                    return Number((Number(sum) - totalAmount).toFixed(2));
                }, 0);
                const totalBalance = Number((Number(journalBalance) +
                    Number(cashBankBalance) +
                    Number(paymentReceiptBalance) +
                    Number(paymentExpenseBalance) +
                    Number(salesInvoiceBalance) +
                    Number(purchaseInvoiceBalance)).toFixed(2));
                return Object.assign(Object.assign({}, account), { balance: totalBalance });
            })));
            return {
                data: accountsWithBalance,
                total: total
            };
        });
    }
}
exports.AccountService = AccountService;
