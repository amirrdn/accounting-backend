import { Request, Response } from "express";
import { BalanceSheetService } from "../services/BalanceSheetService";

export class BalanceSheetController {
  static async getBalanceSheet(req: Request, res: Response) {
    try {
      const endDate = new Date(req.query.end as string || new Date());
      const result = await BalanceSheetService.getBalanceSheet(endDate);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to get balance sheet", error });
    }
  }
}
