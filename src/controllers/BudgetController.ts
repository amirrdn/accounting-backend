import { Request, Response } from "express";
import { BudgetService } from "../services/BudgetService";

export class BudgetController {
    private budgetService = new BudgetService();

    async create(req: Request, res: Response) {
        try {
            const budget = await this.budgetService.createBudget(req.body);
            return res.status(201).json(budget);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const budgets = await this.budgetService.getAllBudgets();
            return res.json(budgets);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const budget = await this.budgetService.getBudgetById(parseInt(id));
            if (!budget) {
                return res.status(404).json({ message: 'Budget not found' });
            }
            return res.json(budget);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.budgetService.deleteBudget(parseInt(id));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getBudgetReport(req: Request, res: Response) {
        try {
            const { year } = req.params;
            const report = await this.budgetService.getBudgetReport(parseInt(year));
            return res.json(report);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async createDetail(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const detail = await this.budgetService.createBudgetDetail(parseInt(id), req.body);
            return res.status(201).json(detail);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async deleteDetail(req: Request, res: Response) {
        try {
            const { id, detailId } = req.params;
            await this.budgetService.deleteBudgetDetail(parseInt(id), parseInt(detailId));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
} 