import { Request, Response } from "express";
import { AccountService } from "../services/AccountService";

export class AccountController {
  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await AccountService.getAll(page, limit);
      
      res.json({
        status: "success",
        data: result.data,
        meta: {
          total: result.total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data"
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const data = await AccountService.getById(+req.params.id);
      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "Account not found"
        });
      }
      res.json({
        status: "success",
        data: data
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data"
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = await AccountService.create(req.body);
      res.status(201).json({
        status: "success",
        data: data
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat membuat data"
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const data = await AccountService.update(+req.params.id, req.body);
      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "Account not found"
        });
      }
      res.json({
        status: "success",
        data: data
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui data"
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await AccountService.delete(+req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({
          status: "error",
          message: "Account not found"
        });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus data"
      });
    }
  }
}
