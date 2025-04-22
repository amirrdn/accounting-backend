import { Request, Response } from "express";
import { AutoPurchaseOrderService } from "../services/AutoPurchaseOrderService";

export class AutoPurchaseOrderController {
  static async getDraftPO(req: Request, res: Response) {
    try {
      const data = await AutoPurchaseOrderService.generateDraftPurchaseOrder();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Gagal generate draft PO", error: err });
    }
  }

  static async createPO(req: Request, res: Response) {
    try {
      const { supplierId, items } = req.body;
      const result = await AutoPurchaseOrderService.createPOFromDraft(supplierId, items);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Gagal membuat PO dari draft", error: err });
    }
  }
  
}
