import { Request, Response } from "express";
import { WarehouseService } from "../services/WarehouseService";

export class WarehouseController {
  private warehouseService = new WarehouseService();

  async getAllWarehouses(req: Request, res: Response): Promise<void> {
    try {
      const warehouses = await this.warehouseService.findAll();
      res.status(200).json(warehouses);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data gudang", error });
    }
  }

  async getWarehouseById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const warehouse = await this.warehouseService.findById(id);
      
      if (warehouse) {
        res.status(200).json(warehouse);
      } else {
        res.status(404).json({ message: "Gudang tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data gudang", error });
    }
  }

  async createWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const warehouseData = req.body;
      const newWarehouse = await this.warehouseService.create(warehouseData);
      res.status(201).json(newWarehouse);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat membuat gudang", error });
    }
  }

  async updateWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const warehouseData = req.body;
      const updatedWarehouse = await this.warehouseService.update(id, warehouseData);
      
      if (updatedWarehouse) {
        res.status(200).json(updatedWarehouse);
      } else {
        res.status(404).json({ message: "Gudang tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengupdate gudang", error });
    }
  }

  async deleteWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.warehouseService.delete(id);
      
      if (success) {
        res.status(200).json({ message: "Gudang berhasil dihapus" });
      } else {
        res.status(404).json({ message: "Gudang tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus gudang", error });
    }
  }
} 