import { Request, Response } from "express";
export declare class BudgetController {
    private budgetService;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getBudgetReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=BudgetController.d.ts.map