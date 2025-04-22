import { Request, Response } from "express";
import { ProductionService } from "../services/ProductionService";

export class ProductionController {
  static async create(req: Request, res: Response) {
    const { productId, quantity, warehouseId } = req.body;

    try {
      const result = await ProductionService.createProductionOrder(productId, quantity, warehouseId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
