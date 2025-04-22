import { Request, Response } from "express";
import { StockService } from "../services/StockService";

export class StockController {
  static async getCurrentStock(req: Request, res: Response) {
    try {
      const productId = +req.params.productId;
      const total = await StockService.getCurrentStock(productId);
      res.json({ productId, stock: total });
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock", error });
    }
  }

  static async getStockCard(req: Request, res: Response) {
    try {
      const productId = +req.params.productId;
      const card = await StockService.getStockCard(productId);
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock card", error });
    }
  }
}
