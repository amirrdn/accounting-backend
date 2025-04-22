import { Request, Response } from "express";
import { StockOpnameService } from "../services/StockOpnameService";
import { AppDataSource } from "../data-source";
import { StockOpname } from "../entity/StockOpname";

export class StockOpnameController {
  static async create(req: Request, res: Response) {
    const { warehouseId, items } = req.body;
    const result = await StockOpnameService.createStockOpname(warehouseId, items);
    res.json(result);
  }

  static async getAll(req: Request, res: Response) {
    try {
      const data = await AppDataSource.getRepository(StockOpname).find({
        relations: ["warehouse", "items", "items.product"],
        order: { date: "DESC" }
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data stock opname", error: err });
    }
  }
}
