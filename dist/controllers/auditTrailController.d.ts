import { Request, Response } from 'express';
export declare class AuditTrailController {
    private auditTrailService;
    getLogs(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getLogById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getLogsByEntity(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=auditTrailController.d.ts.map