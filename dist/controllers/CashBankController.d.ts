import { Request, Response } from "express";
export declare class CashBankController {
    static transfer(req: Request, res: Response): Promise<void>;
    static cashIn(req: Request, res: Response): Promise<void>;
    static cashOut(req: Request, res: Response): Promise<void>;
    static list(req: Request, res: Response): Promise<void>;
    static cashFlow(req: Request, res: Response): Promise<void>;
    static approve(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CashBankController.d.ts.map