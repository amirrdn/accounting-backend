import { Request, Response } from 'express';
import { AuditTrailService } from '../services/auditTrailService';

export class AuditTrailController {
    private auditTrailService = new AuditTrailService();

    async getLogs(req: Request, res: Response) {
        try {
            const filters = {
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
                action: req.query.action as string,
                entityName: req.query.entityName as string,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10
            };

            const logs = await this.auditTrailService.getLogs(filters);
            return res.json(logs);
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: "Error saat mengambil data audit log: " + error.message
            });
        }
    }

    async getLogById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const log = await this.auditTrailService.getLogById(id);
            
            if (!log) {
                return res.status(404).json({
                    status: 404,
                    message: "Audit log tidak ditemukan"
                });
            }
            
            return res.json(log);
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: "Error saat mengambil data audit log: " + error.message
            });
        }
    }

    async getLogsByEntity(req: Request, res: Response) {
        try {
            const { entityName, entityId } = req.params;
            const logs = await this.auditTrailService.getLogsByEntity(entityName, entityId);
            return res.json(logs);
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: "Error saat mengambil data entity log: " + error.message
            });
        }
    }
} 