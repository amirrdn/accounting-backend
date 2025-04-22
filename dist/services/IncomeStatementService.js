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
exports.IncomeStatementService = void 0;
const data_source_1 = require("../data-source");
const JournalDetail_1 = require("../entity/JournalDetail");
const Account_1 = require("../entity/Account");
const typeorm_1 = require("typeorm");
class IncomeStatementService {
    static getProfitLoss(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const detailRepo = data_source_1.AppDataSource.getRepository(JournalDetail_1.JournalDetail);
            const accountRepo = data_source_1.AppDataSource.getRepository(Account_1.Account);
            const accounts = yield accountRepo.find({
                where: { type: (0, typeorm_1.In)(["revenue", "expense"]) },
            });
            const summary = {};
            let totalRevenue = 0;
            let totalExpense = 0;
            for (const acc of accounts) {
                const entries = yield detailRepo.find({
                    where: {
                        account: { id: acc.id },
                        journal: { date: (0, typeorm_1.Between)(start, end) },
                    },
                    relations: ["journal"],
                });
                const total = entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
                summary[acc.name] = total;
                if (acc.type === "revenue")
                    totalRevenue += total * -1;
                if (acc.type === "expense")
                    totalExpense += total;
            }
            return {
                summary,
                totalRevenue,
                totalExpense,
                netIncome: totalRevenue - totalExpense,
            };
        });
    }
}
exports.IncomeStatementService = IncomeStatementService;
