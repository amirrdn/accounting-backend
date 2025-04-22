import { Request, Response } from "express";
import { PurchaseOrderService } from "../services/purchaseOrderService";
import { PurchaseOrderStatus } from "../entity/PurchaseOrder";
import { UploadedFile } from "../services/purchaseOrderService";
import { AuthenticatedRequest } from "../types/request.types";

const purchaseOrderService = new PurchaseOrderService();

export class PurchaseOrderController {
    async createPurchaseOrder(req: Request & { file?: UploadedFile }, res: Response) {
        try {
            const file = req.file;
            const data = req.body.data;
            
            const purchaseOrder = await purchaseOrderService.createPurchaseOrder(data, file);
            res.status(201).json({
                success: true,
                data: purchaseOrder
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getPurchaseOrders(req: Request, res: Response) {
        try {
            const purchaseOrders = await purchaseOrderService.getPurchaseOrders();
            res.status(200).json({
                status: "success",
                data: purchaseOrders
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                code: "PURCHASE_ORDER_GET_ALL_ERROR",
                message: "Terjadi kesalahan saat mengambil data purchase order"
            });
        }
    }

    async getPurchaseOrderById(req: Request, res: Response) {
        try {
            const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(req.params.id);
            res.status(200).json({
                success: true,
                data: purchaseOrder
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updatePurchaseOrderStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const { status, approvalNotes } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                throw new Error("User tidak terautentikasi");
            }

            if (!Object.values(PurchaseOrderStatus).includes(status)) {
                throw new Error("Status tidak valid");
            }

            const purchaseOrder = await purchaseOrderService.updatePurchaseOrderStatus(
                req.params.id, 
                status,
                userId,
                approvalNotes
            );

            res.status(200).json({
                success: true,
                data: purchaseOrder
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deletePurchaseOrder(req: Request, res: Response) {
        try {
            await purchaseOrderService.deletePurchaseOrder(req.params.id);
            res.status(200).json({
                success: true,
                message: "Purchase Order berhasil dihapus"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
} 