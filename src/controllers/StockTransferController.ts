import { Request, Response } from "express";
import { StockTransferService } from "../services/StockTransferService";
import { ExportHelper } from "../utils/ExportHelper";
import { StockTransfer } from "../entity/StockTransfer";
import { AppDataSource } from "../data-source";


export class StockTransferController {
  static async create(req: Request, res: Response) {
    try {
      const result = await StockTransferService.createTransfer(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Gagal membuat transfer", error: err });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const data = await StockTransferService.getAllTransfers();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data transfer", error: err });
    }
  }
  static async exportPDF(req: Request, res: Response) {
    const transfer = await AppDataSource.getRepository(StockTransfer).findOne({
      where: { id: +req.params.id },
      relations: ["fromWarehouse", "toWarehouse", "items", "items.product"],
    });
  
    if (!transfer) return res.status(404).json({ message: "Transfer tidak ditemukan" });
  
    return ExportHelper.generateTransferPDF(transfer, res);
  }
  
  static async exportExcel(req: Request, res: Response) {
    const transfer = await AppDataSource.getRepository(StockTransfer).findOne({
      where: { id: +req.params.id },
      relations: ["fromWarehouse", "toWarehouse", "items", "items.product"],
    });
  
    if (!transfer) return res.status(404).json({ message: "Transfer tidak ditemukan" });
  
    return ExportHelper.generateTransferExcel(transfer, res);
  }
  static async receiveTransfer(req: Request, res: Response) {
    try {
      const result = await StockTransferService.markAsReceived(+req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
