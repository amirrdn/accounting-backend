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
exports.BalanceSheetService = void 0;
const data_source_1 = require("../data-source");
const JournalDetail_1 = require("../entity/JournalDetail");
const Account_1 = require("../entity/Account");
const typeorm_1 = require("typeorm");
class BalanceSheetService {
    static getBalanceSheet(endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const detailRepo = data_source_1.AppDataSource.getRepository(JournalDetail_1.JournalDetail);
            const accountRepo = data_source_1.AppDataSource.getRepository(Account_1.Account);
            const balanceAccounts = yield accountRepo.find({
                where: { type: (0, typeorm_1.In)(["ASSET", "LIABILITY", "EQUITY"]) },
            });
            const balances = {};
            for (const acc of balanceAccounts) {
                const entries = yield detailRepo.find({
                    where: {
                        account: { id: acc.id },
                        journal: { date: (0, typeorm_1.Between)(new Date("1900-01-01"), endDate) },
                    },
                    relations: ["journal"],
                });
                const total = entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
                balances[acc.name] = total;
            }
            return balances;
        });
    }
}
exports.BalanceSheetService = BalanceSheetService;
