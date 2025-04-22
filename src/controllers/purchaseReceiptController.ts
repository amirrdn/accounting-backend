import { Request, Response, NextFunction } from 'express';
import { PurchaseReceiptService } from '../services/purchaseReceiptService';
import { PurchaseReceiptStatus } from '../entity/PurchaseReceipt';
import { CreatePurchaseReceiptDto } from '../types/purchase-receipt.dto';

export class PurchaseReceiptController {
    private purchaseReceiptService: PurchaseReceiptService;

    constructor() {
        this.purchaseReceiptService = new PurchaseReceiptService();
    }

    async createReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            
            if (!data.purchaseOrderId || !data.branchId || !data.receiptDate || !data.items) {
                throw new Error('Data tidak lengkap');
            }

            const receipt = await this.purchaseReceiptService.createReceipt(data);
            res.status(201).json(receipt);
        } catch (error) {
            next(error);
        }
    }

    async getReceipts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const receipts = await this.purchaseReceiptService.getReceipts();
            res.json(receipts);
        } catch (error) {
            next(error);
        }
    }

    async getReceiptById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const receipt = await this.purchaseReceiptService.getReceiptById(req.params.id);
            res.json(receipt);
        } catch (error) {
            next(error);
        }
    }

    async updateReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const receipt = await this.purchaseReceiptService.updateReceipt(req.params.id, req.body);
            res.json(receipt);
        } catch (error) {
            next(error);
        }
    }

    async deleteReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.purchaseReceiptService.deleteReceipt(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async updateReceiptStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const receipt = await this.purchaseReceiptService.updateReceiptStatus(req.params.id, req.body.status);
            res.json(receipt);
        } catch (error) {
            next(error);
        }
    }

    async filterReceipts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = {
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                branchId: req.query.branchId ? Number(req.query.branchId) : undefined,
                supplierId: req.query.supplierId ? Number(req.query.supplierId) : undefined,
                status: req.query.status ? req.query.status as PurchaseReceiptStatus : undefined
            };

            const receipts = await this.purchaseReceiptService.filterReceipts(filters);
            res.json(receipts);
        } catch (error) {
            next(error);
        }
    }
} 