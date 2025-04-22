import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}
export declare class PurchaseRequestController {
    private service;
    constructor();
    create(req: AuthenticatedRequest, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    findAll(req: Request, res: Response): Promise<void>;
    findOne(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    approve(req: AuthenticatedRequest, res: Response): Promise<void>;
    reject(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
//# sourceMappingURL=PurchaseRequestController.d.ts.map