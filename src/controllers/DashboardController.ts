import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";

export class DashboardController {
  static async stockSummary(req: Request, res: Response) {
    const result = await DashboardService.getStockSummary();
    res.json(result);
  }
  static async financeSummary(req: Request, res: Response) {
    const result = await DashboardService.getFinanceSummary();
    res.json(result);
  }
}
