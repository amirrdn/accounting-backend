import { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}
export declare class PettyCashController {
    private pettyCashService;
    constructor();
    create(req: CustomRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    approve(req: CustomRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    reject(req: CustomRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getBalance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
//# sourceMappingURL=PettyCashController.d.ts.map