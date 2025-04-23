import { Request, Response } from "express";
export declare class PurchasePaymentController {
    private paymentService;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getUnpaidInvoices(req: Request, res: Response): Promise<void>;
    generatePaymentNumber(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PurchasePaymentController.d.ts.map