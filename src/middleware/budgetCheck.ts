import { Request, Response, NextFunction } from "express";
import { BudgetService } from "../services/BudgetService";

export const checkBudget = async (req: Request, res: Response, next: NextFunction) => {
    const budgetService = new BudgetService();
    const { accountId, amount } = req.body;
    
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    try {
        const isWithinBudget = await budgetService.checkBudgetLimit(accountId, amount, month, year);
        
        if (!isWithinBudget) {
            return res.status(403).json({
                message: "Transaction exceeds budget limit for this account"
            });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}; 