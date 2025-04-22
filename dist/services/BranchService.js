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
exports.BranchService = void 0;
const data_source_1 = require("../data-source");
const Branch_1 = require("../entity/Branch");
class BranchService {
    constructor() {
        this.branchRepository = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const branch = this.branchRepository.create(data);
            return yield this.branchRepository.save(branch);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.branchRepository.find();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.branchRepository.findOneBy({ id });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.branchRepository.update(id, data);
            return yield this.branchRepository.findOneBy({ id });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.branchRepository.delete(id);
        });
    }
    getTransactionsByBranch(branchId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.branchRepository
                .createQueryBuilder("branch")
                .leftJoinAndSelect("branch.cashBankTransactions", "cashBank")
                .leftJoinAndSelect("branch.journalEntries", "journal")
                .leftJoinAndSelect("branch.salesInvoices", "sales")
                .leftJoinAndSelect("branch.purchaseInvoices", "purchase")
                .where("branch.id = :branchId", { branchId })
                .andWhere("(cashBank.date BETWEEN :startDate AND :endDate OR " +
                "journal.date BETWEEN :startDate AND :endDate OR " +
                "sales.date BETWEEN :startDate AND :endDate OR " +
                "purchase.date BETWEEN :startDate AND :endDate)", { startDate, endDate })
                .getOne();
            return result;
        });
    }
    getConsolidatedReport(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.branchRepository
                .createQueryBuilder("branch")
                .leftJoinAndSelect("branch.cashBankTransactions", "cashBank")
                .leftJoinAndSelect("branch.journalEntries", "journal")
                .leftJoinAndSelect("branch.salesInvoices", "sales")
                .leftJoinAndSelect("branch.purchaseInvoices", "purchase")
                .where("(cashBank.date BETWEEN :startDate AND :endDate OR " +
                "journal.date BETWEEN :startDate AND :endDate OR " +
                "sales.date BETWEEN :startDate AND :endDate OR " +
                "purchase.date BETWEEN :startDate AND :endDate)", { startDate, endDate })
                .getMany();
            return result;
        });
    }
}
exports.BranchService = BranchService;
