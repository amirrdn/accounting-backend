import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const result = await ProductService.getAll(page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data produk", error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await ProductService.getById(id);
      
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Produk tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data produk", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = await ProductService.create(req.body);
      res.status(201).json({
        status: "success",
        data: data
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "PRODUCT_CREATE_ERROR",
        message: error.message || "Terjadi kesalahan saat membuat produk"
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const data = await ProductService.update(+req.params.id, req.body);
      if (!data) {
        return res.status(404).json({
          status: "error",
          code: "PRODUCT_NOT_FOUND",
          message: "Produk tidak ditemukan"
        });
      }
      res.json({
        status: "success",
        data: data
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "PRODUCT_UPDATE_ERROR",
        message: error.message || "Terjadi kesalahan saat mengupdate produk"
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ProductService.delete(+req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        status: "error",
        code: "PRODUCT_DELETE_ERROR",
        message: "Terjadi kesalahan saat menghapus produk"
      });
    }
  }
}
