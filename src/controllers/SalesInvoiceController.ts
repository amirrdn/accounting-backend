import { Request, Response } from "express";
import { SalesInvoiceService } from "../services/SalesInvoiceService";

export class SalesInvoiceController {
  static async getAll(req: Request, res: Response) {
    const data = await SalesInvoiceService.getAll();
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const data = await SalesInvoiceService.getById(+req.params.id);
    if (!data) return res.status(404).json({ message: "Invoice not found" });
    res.json(data);
  }

  static async create(req: Request, res: Response) {
    const data = await SalesInvoiceService.create(req.body);
    res.status(201).json(data);
  }

  static async update(req: Request, res: Response) {
    const data = await SalesInvoiceService.update(+req.params.id, req.body);
    res.json(data);
  }

  static async delete(req: Request, res: Response) {
    await SalesInvoiceService.delete(+req.params.id);
    res.status(204).send();
  }
}
