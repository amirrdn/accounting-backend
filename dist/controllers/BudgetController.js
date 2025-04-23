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
exports.BudgetController = void 0;
const BudgetService_1 = require("../services/BudgetService");
class BudgetController {
    constructor() {
        this.budgetService = new BudgetService_1.BudgetService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const budget = yield this.budgetService.createBudget(req.body);
                return res.status(201).json(budget);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const budgets = yield this.budgetService.getAllBudgets();
                return res.json(budgets);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const budget = yield this.budgetService.getBudgetById(parseInt(id));
                if (!budget) {
                    return res.status(404).json({ message: 'Budget not found' });
                }
                return res.json(budget);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.budgetService.deleteBudget(parseInt(id));
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    getBudgetReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { year } = req.params;
                const report = yield this.budgetService.getBudgetReport(parseInt(year));
                return res.json(report);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    createDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const detail = yield this.budgetService.createBudgetDetail(parseInt(id), req.body);
                return res.status(201).json(detail);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, detailId } = req.params;
                yield this.budgetService.deleteBudgetDetail(parseInt(id), parseInt(detailId));
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.BudgetController = BudgetController;
