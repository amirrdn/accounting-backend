import { Request, Response } from "express";
import { SupplierService } from "../services/SupplierService";

export class SupplierController {
  static async getAll(req: Request, res: Response) {
    const data = await SupplierService.getAll();
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const data = await SupplierService.getById(+req.params.id);
    if (!data) return res.status(404).json({ message: "Supplier not found" });
    res.json(data);
  }

  static async create(req: Request, res: Response) {
    const data = await SupplierService.create(req.body);
    res.status(201).json(data);
  }

  static async update(req: Request, res: Response) {
    const data = await SupplierService.update(+req.params.id, req.body);
    res.json(data);
  }

  static async delete(req: Request, res: Response) {
    await SupplierService.delete(+req.params.id);
    res.status(204).send();
  }
}
