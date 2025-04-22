import { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}
export declare class StockAdjustmentController {
    static adjustStock(req: CustomRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static listAdjustments(req: Request, res: Response): Promise<void>;
    static approve(req: Request, res: Response): Promise<void>;
}
export {};
//# sourceMappingURL=StockAdjustmentController.d.ts.map