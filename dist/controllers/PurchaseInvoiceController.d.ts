import { Request, Response } from "express";
export declare class PurchaseInvoiceController {
    private purchaseInvoiceService;
    constructor();
    createPurchaseInvoice(req: Request, res: Response): Promise<void>;
    updatePurchaseInvoice(req: Request, res: Response): Promise<void>;
    getPurchaseInvoices(req: Request, res: Response): Promise<void>;
    getPurchaseInvoiceById(req: Request, res: Response): Promise<void>;
    updatePurchaseInvoiceStatus(req: Request, res: Response): Promise<void>;
    deletePurchaseInvoice(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PurchaseInvoiceController.d.ts.map