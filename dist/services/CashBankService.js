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
exports.CashBankService = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const CashBankTransaction_1 = require("../entity/CashBankTransaction");
const JournalHelper_1 = require("../utils/JournalHelper");
const JournalDetail_1 = require("../entity/JournalDetail");
class CashBankService {
    static transfer(sourceId_1, destinationAccountId_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (sourceId, destinationAccountId, amount, description = "", branchId, date) {
            if (sourceId === destinationAccountId)
                throw new Error("Akun sumber dan tujuan tidak boleh sama");
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const balance = yield this.getAccountBalance(sourceId);
                if (balance < amount) {
                    throw new Error("Saldo tidak cukup untuk transfer");
                }
                const txRepo = queryRunner.manager.getRepository(CashBankTransaction_1.CashBankTransaction);
                const tx = txRepo.create({
                    type: "TRANSFER",
                    amount,
                    description,
                    sourceAccount: { id: sourceId },
                    destinationAccount: { id: destinationAccountId },
                    branch: { id: branchId },
                    date: date || new Date()
                });
                yield txRepo.save(tx);
                yield JournalHelper_1.JournalHelper.createJournal({
                    reference: `TRANSFER-${tx.id}`,
                    description: `Transfer kas: ${description}`,
                    branch: { id: branchId },
                    date: date || new Date(),
                    entries: [
                        { accountId: destinationAccountId, debit: amount, credit: 0 },
                        { accountId: sourceId, debit: 0, credit: amount },
                    ],
                }, queryRunner);
                yield queryRunner.commitTransaction();
                return tx;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    static cashIn(accountId_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, amount, description = "", branchId, destinationAccountId, date) {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const txRepo = queryRunner.manager.getRepository(CashBankTransaction_1.CashBankTransaction);
                const tx = txRepo.create({
                    type: "IN",
                    amount: Number(amount),
                    description,
                    sourceAccount: { id: accountId },
                    destinationAccount: { id: destinationAccountId },
                    branch: { id: branchId },
                    date: date || new Date()
                });
                yield txRepo.save(tx);
                yield JournalHelper_1.JournalHelper.createJournal({
                    reference: `CASH_IN-${tx.id}`,
                    description: `Kas Masuk: ${description}`,
                    branch: { id: branchId },
                    date: date || new Date(),
                    entries: [
                        { accountId: destinationAccountId, debit: Number(amount), credit: 0 },
                        { accountId: accountId, debit: 0, credit: Number(amount) }
                    ],
                }, queryRunner);
                yield queryRunner.commitTransaction();
                return tx;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    static cashOut(accountId_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, amount, description = "", branchId, destinationAccountId, date) {
            const txRepo = data_source_1.AppDataSource.getRepository(CashBankTransaction_1.CashBankTransaction);
            const tx = txRepo.create({
                type: "OUT",
                amount: Number(amount),
                description,
                sourceAccount: { id: accountId },
                destinationAccount: { id: destinationAccountId },
                branch: { id: branchId },
                date: date || new Date()
            });
            yield txRepo.save(tx);
            yield JournalHelper_1.JournalHelper.createJournal({
                reference: `CASH_OUT-${tx.id}`,
                description: `Kas Keluar: ${description}`,
                branch: { id: branchId },
                date: date || new Date(),
                entries: [
                    { accountId: destinationAccountId, debit: Number(amount), credit: 0 },
                    { accountId: accountId, debit: 0, credit: Number(amount) }
                ],
            });
            return tx;
        });
    }
    static listTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.getRepository(CashBankTransaction_1.CashBankTransaction).find({
                relations: ["sourceAccount", "destinationAccount", "branch"],
                order: { date: "DESC" }
            });
        });
    }
    static getCashFlow(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(CashBankTransaction_1.CashBankTransaction);
            const txs = yield repo.find({
                where: {
                    date: (0, typeorm_1.Between)(start, end)
                },
                relations: ["sourceAccount", "destinationAccount", "branch"]
            });
            const result = {
                cashIn: 0,
                cashOut: 0,
                transfer: 0,
                details: txs.map(tx => ({
                    date: tx.date,
                    type: tx.type,
                    amount: tx.amount,
                    description: tx.description
                }))
            };
            for (const tx of txs) {
                if (tx.type === "IN")
                    result.cashIn += Number(tx.amount);
                else if (tx.type === "OUT")
                    result.cashOut += Number(tx.amount);
                else if (tx.type === "TRANSFER")
                    result.transfer += Number(tx.amount);
            }
            return result;
        });
    }
    static approve(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(CashBankTransaction_1.CashBankTransaction);
            const tx = yield repo.findOneByOrFail({ id });
            if (tx.isApproved)
                throw new Error("Sudah disetujui");
            tx.isApproved = true;
            yield repo.save(tx);
            if (tx.type === "TRANSFER") {
                yield JournalHelper_1.JournalHelper.createJournal({
                    reference: `TRANSFER_APPROVED-${tx.id}`,
                    description: `Transfer Kas APPROVED`,
                    entries: [
                        { accountId: tx.destinationAccount.id, debit: tx.amount, credit: 0 },
                        { accountId: tx.sourceAccount.id, debit: 0, credit: tx.amount }
                    ],
                });
            }
            return tx;
        });
    }
    static getAccountBalance(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const journalRepo = data_source_1.AppDataSource.getRepository(JournalDetail_1.JournalDetail);
            const result = yield journalRepo
                .createQueryBuilder("detail")
                .select("SUM(detail.debit)", "totalDebit")
                .addSelect("SUM(detail.credit)", "totalCredit")
                .where("detail.accountId = :accountId", { accountId })
                .getRawOne();
            const debit = Number((result === null || result === void 0 ? void 0 : result.totalDebit) || 0);
            const credit = Number((result === null || result === void 0 ? void 0 : result.totalCredit) || 0);
            return debit - credit;
        });
    }
}
exports.CashBankService = CashBankService;
