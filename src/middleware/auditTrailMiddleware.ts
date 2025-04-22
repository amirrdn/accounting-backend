import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import { AuditTrail } from '../entity/AuditTrail';
import logger from '../utils/logger';

export const auditTrailMiddleware = async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) => {
    const originalJson = res.json;
    
    res.json = function (data: any) {
        res.json = originalJson;
        
        if (req.method !== 'GET') {
            const auditTrail = new AuditTrail();
            auditTrail.userId = req.user?.id;
            auditTrail.action = req.method === 'POST' ? 'CREATE' :
                               req.method === 'PUT' || req.method === 'PATCH' ? 'UPDATE' :
                               req.method === 'DELETE' ? 'DELETE' : 'OTHER';
            auditTrail.entityName = req.path.split('/')[1];
            auditTrail.entityId = req.params.id ?? '';
            auditTrail.newValues = req.method !== 'DELETE' ? req.body : null;
            auditTrail.ipAddress = req.ip || 'unknown';
            auditTrail.userAgent = req.get('user-agent') ?? '';
            
            getConnection()
                .getRepository(AuditTrail)
                .save(auditTrail)
                .catch(error => {
                    logger.error('Failed to save audit trail', {
                        error: error.message,
                        stack: error.stack,
                        userId: auditTrail.userId,
                        action: auditTrail.action,
                        entityName: auditTrail.entityName,
                        entityId: auditTrail.entityId
                    });
                });
        }
        
        return originalJson.call(this, data);
    };
    
    next();
}; 