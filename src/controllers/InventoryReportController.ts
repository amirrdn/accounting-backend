import { Request, Response } from "express";
import { InventoryReportService } from "../services/InventoryReportService";

export class InventoryReportController {
  static async getInventoryValue(req: Request, res: Response) {
    try {
      const data = await InventoryReportService.getInventoryValueReport();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil laporan persediaan", error });
    }
  }
}
