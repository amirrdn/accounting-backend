import { getRepository } from "typeorm";
import { AuditTrail } from "../entity/AuditTrail";

export class AuditTrailService {
    private auditTrailRepository = getRepository(AuditTrail);

    async getLogs(filters: {
        startDate?: Date;
        endDate?: Date;
        userId?: number;
        action?: string;
        entityName?: string;
        page?: number;
        limit?: number;
    }) {
        const query = this.auditTrailRepository.createQueryBuilder("audit");

        if (filters.startDate) {
            query.andWhere("audit.createdAt >= :startDate", { startDate: filters.startDate });
        }

        if (filters.endDate) {
            query.andWhere("audit.createdAt <= :endDate", { endDate: filters.endDate });
        }

        if (filters.userId) {
            query.andWhere("audit.userId = :userId", { userId: filters.userId });
        }

        if (filters.action) {
            query.andWhere("audit.action = :action", { action: filters.action });
        }

        if (filters.entityName) {
            query.andWhere("audit.entityName = :entityName", { entityName: filters.entityName });
        }

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        query.skip(skip).take(limit);
        query.orderBy("audit.createdAt", "DESC");

        const [items, total] = await query.getManyAndCount();

        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getLogById(id: number) {
        return await this.auditTrailRepository.findOne({ where: { id } });
    }

    async getLogsByEntity(entityName: string, entityId: string) {
        return await this.auditTrailRepository.find({
            where: { entityName, entityId },
            order: { createdAt: "DESC" }
        });
    }
}