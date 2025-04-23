import { Request, Response, NextFunction } from 'express';
export declare class PurchaseReceiptController {
    private purchaseReceiptService;
    constructor();
    createReceipt(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReceipts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReceiptById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateReceipt(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteReceipt(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateReceiptStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    filterReceipts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=purchaseReceiptController.d.ts.map