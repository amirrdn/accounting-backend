import { Request, Response } from "express";
import { IncomeStatementService } from "../services/IncomeStatementService";

export class IncomeStatementController {
  static async getIncomeStatement(req: Request, res: Response) {
    try {
      const start = new Date(req.query.start as string);
      const end = new Date(req.query.end as string);
      const result = await IncomeStatementService.getProfitLoss(start, end);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to get income statement", error });
    }
  }
}
