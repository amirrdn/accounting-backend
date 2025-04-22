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
exports.JournalHelper = void 0;
const data_source_1 = require("../data-source");
const JournalEntry_1 = require("../entity/JournalEntry");
const JournalDetail_1 = require("../entity/JournalDetail");
const Account_1 = require("../entity/Account");
class JournalHelper {
    static generateJournalNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(JournalEntry_1.JournalEntry);
            const lastJournal = yield repo.findOne({
                where: {},
                order: { date: 'DESC' }
            });
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            if (!lastJournal) {
                return `J${year}${month}0001`;
            }
            const lastNumber = parseInt(lastJournal.number.slice(-4));
            const newNumber = (lastNumber + 1).toString().padStart(4, '0');
            return `J${year}${month}${newNumber}`;
        });
    }
    static createJournal(data, queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const entryRepo = queryRunner ? queryRunner.manager.getRepository(JournalEntry_1.JournalEntry) : data_source_1.AppDataSource.getRepository(JournalEntry_1.JournalEntry);
            const detailRepo = queryRunner ? queryRunner.manager.getRepository(JournalDetail_1.JournalDetail) : data_source_1.AppDataSource.getRepository(JournalDetail_1.JournalDetail);
            const accountRepo = queryRunner ? queryRunner.manager.getRepository(Account_1.Account) : data_source_1.AppDataSource.getRepository(Account_1.Account);
            const totalDebit = data.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
            const totalCredit = data.entries.reduce((sum, e) => sum + (e.credit || 0), 0);
            if (totalDebit !== totalCredit) {
                throw new Error("Journal not balanced: total debit and credit must match.");
            }
            const journal = new JournalEntry_1.JournalEntry();
            journal.number = yield this.generateJournalNumber();
            journal.reference = data.reference;
            journal.description = data.description;
            journal.date = data.date || new Date();
            journal.details = [];
            if (data.branch) {
                journal.branch = data.branch;
            }
            for (const e of data.entries) {
                const account = yield accountRepo.findOneByOrFail({ id: e.accountId });
                const detail = new JournalDetail_1.JournalDetail();
                detail.account = account;
                detail.debit = e.debit || 0;
                detail.credit = e.credit || 0;
                detail.description = e.description || "";
                journal.details.push(detail);
            }
            return entryRepo.save(journal);
        });
    }
}
exports.JournalHelper = JournalHelper;
