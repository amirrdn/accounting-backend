import { Request, Response } from "express";
import { UploadedFile } from "../services/purchaseOrderService";
import { AuthenticatedRequest } from "../types/request.types";
export declare class PurchaseOrderController {
    createPurchaseOrder(req: Request & {
        file?: UploadedFile;
    }, res: Response): Promise<void>;
    getPurchaseOrders(req: Request, res: Response): Promise<void>;
    getPurchaseOrderById(req: Request, res: Response): Promise<void>;
    updatePurchaseOrderStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
    deletePurchaseOrder(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=purchaseOrderController.d.ts.map