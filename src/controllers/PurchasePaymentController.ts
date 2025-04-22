import { Request, Response } from "express";
import { PurchasePaymentService } from "../services/PurchasePaymentService";

export class PurchasePaymentController {
  private paymentService = new PurchasePaymentService();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, search, startDate, endDate } = req.query;
      
      const result = await this.paymentService.findAll({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data pembayaran",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.findById(Number(id));

      if (!payment) {
        res.status(404).json({
          message: "Data pembayaran tidak ditemukan"
        });
        return;
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data pembayaran",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const payment = await this.paymentService.create(req.body);
      res.status(201).json({
        status: "success",
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        code: "PURCHASE_PAYMENT_CREATE_ERROR",
        message: "Terjadi kesalahan saat membuat pembayaran",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.update(Number(id), req.body);
      res.json(payment);
    } catch (error) {
      res.status(400).json({
        message: "Terjadi kesalahan saat mengupdate pembayaran",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.paymentService.delete(Number(id));
      res.json({
        message: "Pembayaran berhasil dihapus"
      });
    } catch (error) {
      res.status(400).json({
        message: "Terjadi kesalahan saat menghapus pembayaran",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async getUnpaidInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { supplierId } = req.params;
      const invoices = await this.paymentService.getUnpaidInvoices(parseInt(supplierId));
      res.json(invoices);
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil daftar invoice",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async generatePaymentNumber(req: Request, res: Response): Promise<void> {
    try {
      const number = await this.paymentService.generatePaymentNumber();
      res.json({ number });
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat generate nomor pembayaran",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
} 