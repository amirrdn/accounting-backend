import { Request, Response } from "express";
import { StockAdjustmentService } from "../services/StockAdjustmentService";

interface CustomRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export class StockAdjustmentController {
  static async adjustStock(req: CustomRequest, res: Response) {
    try {
      const { productId, actualQty, reason } = req.body;
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user.id;

      const result = await StockAdjustmentService.adjustStock(productId, actualQty, userId, reason);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to adjust stock", error });
    }
  }

  static async listAdjustments(req: Request, res: Response) {
    try {
      const data = await StockAdjustmentService.getAdjustments();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to list adjustments", error });
    }
  }

  static async approve(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await StockAdjustmentService.approveAdjustment(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve adjustment", error });
    }
  }
}
