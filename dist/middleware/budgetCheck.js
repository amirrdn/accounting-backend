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
exports.checkBudget = void 0;
const BudgetService_1 = require("../services/BudgetService");
const checkBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const budgetService = new BudgetService_1.BudgetService();
    const { accountId, amount } = req.body;
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    try {
        const isWithinBudget = yield budgetService.checkBudgetLimit(accountId, amount, month, year);
        if (!isWithinBudget) {
            return res.status(403).json({
                message: "Transaction exceeds budget limit for this account"
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.checkBudget = checkBudget;
