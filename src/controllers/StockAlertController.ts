import { Request, Response } from "express";
import { StockAlertService } from "../services/StockAlertService";

export class StockAlertController {
  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await StockAlertService.getLowStockProducts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data stok minimum", error: err });
    }
  }
}
