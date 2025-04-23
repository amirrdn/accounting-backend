import { Request, Response } from "express";
export declare class StockTransferController {
    static create(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static exportPDF(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    static exportExcel(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    static receiveTransfer(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=StockTransferController.d.ts.map