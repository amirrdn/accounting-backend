import { Request, Response } from "express";
import { CustomerService } from "../services/CustomerService";

export class CustomerController {
  static async getAll(req: Request, res: Response) {
    const data = await CustomerService.getAll();
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const data = await CustomerService.getById(+req.params.id);
    if (!data) return res.status(404).json({ message: "Customer not found" });
    res.json(data);
  }

  static async create(req: Request, res: Response) {
    const data = await CustomerService.create(req.body);
    res.status(201).json(data);
  }

  static async update(req: Request, res: Response) {
    const data = await CustomerService.update(+req.params.id, req.body);
    res.json(data);
  }

  static async delete(req: Request, res: Response) {
    await CustomerService.delete(+req.params.id);
    res.status(204).send();
  }
}
