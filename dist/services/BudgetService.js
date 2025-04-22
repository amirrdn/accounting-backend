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
exports.BudgetService = void 0;
const data_source_1 = require("../data-source");
const Budget_1 = require("../entity/Budget");
const BudgetDetail_1 = require("../entity/BudgetDetail");
const Account_1 = require("../entity/Account");
class BudgetService {
    constructor() {
        this.budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
        this.budgetDetailRepository = data_source_1.AppDataSource.getRepository(BudgetDetail_1.BudgetDetail);
        this.accountRepository = data_source_1.AppDataSource.getRepository(Account_1.Account);
    }
    getAllBudgets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.budgetRepository.find({
                relations: ['details', 'details.account']
            });
        });
    }
    getBudgetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.budgetRepository.findOne({
                where: { id },
                relations: ['details', 'details.account']
            });
        });
    }
    deleteBudget(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const budget = yield this.budgetRepository.findOne({
                where: { id },
                relations: ['details']
            });
            if (!budget) {
                throw new Error('Budget not found');
            }
            if (budget.details) {
                yield this.budgetDetailRepository.remove(budget.details);
            }
            yield this.budgetRepository.remove(budget);
        });
    }
    createBudget(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const budget = new Budget_1.Budget();
            budget.name = data.name;
            budget.year = data.year;
            budget.description = data.description;
            budget.isActive = true;
            const savedBudget = yield this.budgetRepository.save(budget);
            for (const detail of data.details) {
                const account = yield this.accountRepository.findOne({ where: { id: detail.accountId } });
                if (!account)
                    continue;
                const budgetDetail = new BudgetDetail_1.BudgetDetail();
                budgetDetail.budget = savedBudget;
                budgetDetail.account = account;
                budgetDetail.januaryAmount = detail.monthlyAmounts[0] || 0;
                budgetDetail.februaryAmount = detail.monthlyAmounts[1] || 0;
                budgetDetail.marchAmount = detail.monthlyAmounts[2] || 0;
                budgetDetail.aprilAmount = detail.monthlyAmounts[3] || 0;
                budgetDetail.mayAmount = detail.monthlyAmounts[4] || 0;
                budgetDetail.juneAmount = detail.monthlyAmounts[5] || 0;
                budgetDetail.julyAmount = detail.monthlyAmounts[6] || 0;
                budgetDetail.augustAmount = detail.monthlyAmounts[7] || 0;
                budgetDetail.septemberAmount = detail.monthlyAmounts[8] || 0;
                budgetDetail.octoberAmount = detail.monthlyAmounts[9] || 0;
                budgetDetail.novemberAmount = detail.monthlyAmounts[10] || 0;
                budgetDetail.decemberAmount = detail.monthlyAmounts[11] || 0;
                budgetDetail.totalAmount = detail.monthlyAmounts.reduce((a, b) => a + b, 0);
                yield this.budgetDetailRepository.save(budgetDetail);
            }
            return savedBudget;
        });
    }
    getBudgetReport(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const budget = yield this.budgetRepository.findOne({
                where: { year },
                relations: ['details', 'details.account']
            });
            if (!budget) {
                throw new Error('Budget not found');
            }
            return budget;
        });
    }
    createBudgetDetail(budgetId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const budget = yield this.budgetRepository.findOne({ where: { id: budgetId } });
            if (!budget) {
                throw new Error('Budget not found');
            }
            const account = yield this.accountRepository.findOne({ where: { id: data.accountId } });
            if (!account) {
                throw new Error('Account not found');
            }
            const budgetDetail = new BudgetDetail_1.BudgetDetail();
            budgetDetail.budget = budget;
            budgetDetail.account = account;
            budgetDetail.januaryAmount = data.januaryAmount || 0;
            budgetDetail.februaryAmount = data.februaryAmount || 0;
            budgetDetail.marchAmount = data.marchAmount || 0;
            budgetDetail.aprilAmount = data.aprilAmount || 0;
            budgetDetail.mayAmount = data.mayAmount || 0;
            budgetDetail.juneAmount = data.juneAmount || 0;
            budgetDetail.julyAmount = data.julyAmount || 0;
            budgetDetail.augustAmount = data.augustAmount || 0;
            budgetDetail.septemberAmount = data.septemberAmount || 0;
            budgetDetail.octoberAmount = data.octoberAmount || 0;
            budgetDetail.novemberAmount = data.novemberAmount || 0;
            budgetDetail.decemberAmount = data.decemberAmount || 0;
            budgetDetail.totalAmount = [
                budgetDetail.januaryAmount,
                budgetDetail.februaryAmount,
                budgetDetail.marchAmount,
                budgetDetail.aprilAmount,
                budgetDetail.mayAmount,
                budgetDetail.juneAmount,
                budgetDetail.julyAmount,
                budgetDetail.augustAmount,
                budgetDetail.septemberAmount,
                budgetDetail.octoberAmount,
                budgetDetail.novemberAmount,
                budgetDetail.decemberAmount
            ].reduce((a, b) => a + b, 0);
            return yield this.budgetDetailRepository.save(budgetDetail);
        });
    }
    deleteBudgetDetail(budgetId, detailId) {
        return __awaiter(this, void 0, void 0, function* () {
            const budgetDetail = yield this.budgetDetailRepository.findOne({
                where: { id: detailId, budget: { id: budgetId } }
            });
            if (!budgetDetail) {
                throw new Error('Budget detail not found');
            }
            yield this.budgetDetailRepository.remove(budgetDetail);
        });
    }
    checkBudgetLimit(accountId, amount, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const budget = yield this.budgetRepository.findOne({
                where: { year, isActive: true },
                relations: ['details', 'details.account']
            });
            if (!budget)
                return true;
            const budgetDetail = budget.details.find(d => d.account.id === accountId);
            if (!budgetDetail)
                return true;
            const monthlyBudgets = [
                budgetDetail.januaryAmount,
                budgetDetail.februaryAmount,
                budgetDetail.marchAmount,
                budgetDetail.aprilAmount,
                budgetDetail.mayAmount,
                budgetDetail.juneAmount,
                budgetDetail.julyAmount,
                budgetDetail.augustAmount,
                budgetDetail.septemberAmount,
                budgetDetail.octoberAmount,
                budgetDetail.novemberAmount,
                budgetDetail.decemberAmount
            ];
            const monthlyBudget = monthlyBudgets[month - 1];
            const actualAmount = budgetDetail.actualAmount || 0;
            return (actualAmount + amount) <= monthlyBudget;
        });
    }
}
exports.BudgetService = BudgetService;
