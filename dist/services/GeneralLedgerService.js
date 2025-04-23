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
exports.GeneralLedgerService = void 0;
const data_source_1 = require("../data-source");
const JournalDetail_1 = require("../entity/JournalDetail");
const typeorm_1 = require("typeorm");
class GeneralLedgerService {
    static getLedger(accountId, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(JournalDetail_1.JournalDetail);
            const entries = yield repo.find({
                where: {
                    account: { id: accountId },
                    journal: {
                        date: (0, typeorm_1.Between)(start, end),
                    },
                },
                relations: ["journal", "account"],
                order: { journal: { date: "ASC" } },
            });
            let saldo = 0;
            const result = entries.map((e) => {
                saldo += e.debit - e.credit;
                return {
                    date: e.journal.date,
                    description: e.journal.description,
                    debit: e.debit,
                    credit: e.credit,
                    saldo,
                };
            });
            return result;
        });
    }
}
exports.GeneralLedgerService = GeneralLedgerService;
