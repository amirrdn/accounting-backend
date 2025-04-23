import { Request, Response } from "express";
export declare class BranchController {
    private branchService;
    constructor();
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getBranchReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getConsolidatedReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=BranchController.d.ts.map