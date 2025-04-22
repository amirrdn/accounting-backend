import { Request, Response } from "express";
import { DepartmentService } from "../services/DepartmentService";

export class DepartmentController {
  private departmentService = new DepartmentService();

  async getAllDepartments(req: Request, res: Response): Promise<void> {
    try {
      const departments = await this.departmentService.findAll();
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data departemen", error });
    }
  }

  async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const department = await this.departmentService.findById(id);
      
      if (department) {
        res.status(200).json(department);
      } else {
        res.status(404).json({ message: "Departemen tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data departemen", error });
    }
  }

  async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const departmentData = req.body;
      const newDepartment = await this.departmentService.create(departmentData);
      res.status(201).json(newDepartment);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat membuat departemen", error });
    }
  }

  async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const departmentData = req.body;
      const updatedDepartment = await this.departmentService.update(id, departmentData);
      
      if (updatedDepartment) {
        res.status(200).json(updatedDepartment);
      } else {
        res.status(404).json({ message: "Departemen tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengupdate departemen", error });
    }
  }

  async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.departmentService.delete(id);
      
      if (success) {
        res.status(200).json({ message: "Departemen berhasil dihapus" });
      } else {
        res.status(404).json({ message: "Departemen tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus departemen", error });
    }
  }
} 