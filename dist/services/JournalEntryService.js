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
exports.JournalEntryService = void 0;
const data_source_1 = require("../data-source");
const JournalEntry_1 = require("../entity/JournalEntry");
const repo = data_source_1.AppDataSource.getRepository(JournalEntry_1.JournalEntry);
class JournalEntryService {
    static getAll() {
        return repo.find();
    }
    static getById(id) {
        return repo.findOneBy({ id });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const journal = repo.create(data);
            const totalDebit = ((_a = data.details) === null || _a === void 0 ? void 0 : _a.reduce((sum, d) => sum + Number(d.debit || 0), 0)) || 0;
            const totalCredit = ((_b = data.details) === null || _b === void 0 ? void 0 : _b.reduce((sum, d) => sum + Number(d.credit || 0), 0)) || 0;
            if (totalDebit !== totalCredit) {
                throw new Error("Total debit and credit must be equal");
            }
            return repo.save(journal);
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield repo.update(id, data);
            return repo.findOneBy({ id });
        });
    }
    static delete(id) {
        return repo.delete(id);
    }
}
exports.JournalEntryService = JournalEntryService;
