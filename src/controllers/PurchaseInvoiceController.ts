import { Request, Response } from "express";
import { PurchaseInvoiceService } from "../services/PurchaseInvoiceService";
import { PurchaseInvoiceStatus } from "../entity/PurchaseInvoice";

export class PurchaseInvoiceController {
    private purchaseInvoiceService: PurchaseInvoiceService;

    constructor() {
        this.purchaseInvoiceService = new PurchaseInvoiceService();
    }

    async createPurchaseInvoice(req: Request, res: Response) {
        try {
            const file = req.file;
            const purchaseInvoice = await this.purchaseInvoiceService.createPurchaseInvoice(req.body, file);
            res.status(201).json(purchaseInvoice);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updatePurchaseInvoice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const file = req.file;
            const purchaseInvoice = await this.purchaseInvoiceService.updatePurchaseInvoice(Number(id), req.body, file);
            res.json(purchaseInvoice);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPurchaseInvoices(req: Request, res: Response) {
        try {
            if (!this.purchaseInvoiceService) {
                this.purchaseInvoiceService = new PurchaseInvoiceService();
            }
            const purchaseInvoices = await this.purchaseInvoiceService.getAll();
            res.json(purchaseInvoices);
        } catch (error: any) {
            if (error instanceof Error) {
                res.status(500).json({
                    status: 500,
                    message: "Error saat mengambil data invoice: " + error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: "Terjadi kesalahan saat mengambil data invoice"
                });
            }
        }
    }

    async getPurchaseInvoiceById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const purchaseInvoice = await this.purchaseInvoiceService.getById(Number(id));
            res.json(purchaseInvoice);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updatePurchaseInvoiceStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const purchaseInvoice = await this.purchaseInvoiceService.updatePurchaseInvoiceStatus(Number(id), status as PurchaseInvoiceStatus);
            res.json(purchaseInvoice);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deletePurchaseInvoice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.purchaseInvoiceService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
