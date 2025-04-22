import { AuditTrail } from "../entity/AuditTrail";
export declare class AuditTrailService {
    private auditTrailRepository;
    getLogs(filters: {
        startDate?: Date;
        endDate?: Date;
        userId?: number;
        action?: string;
        entityName?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: AuditTrail[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLogById(id: number): Promise<AuditTrail | null>;
    getLogsByEntity(entityName: string, entityId: string): Promise<AuditTrail[]>;
}
//# sourceMappingURL=auditTrailService.d.ts.map