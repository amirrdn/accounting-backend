import { StockTransfer } from "../entity/StockTransfer";
import { Response } from "express";
export declare class ExportHelper {
    static generateTransferPDF(transfer: StockTransfer, res: Response): Promise<void>;
    static generateTransferExcel(transfer: StockTransfer, res: Response): Promise<void>;
}
//# sourceMappingURL=ExportHelper.d.ts.map