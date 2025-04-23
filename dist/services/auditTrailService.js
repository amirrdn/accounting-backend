"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditTrailService = void 0;
const typeorm_1 = require("typeorm");
const AuditTrail_1 = require("../entity/AuditTrail");
class AuditTrailService {
    constructor() {
        this.auditTrailRepository = (0, typeorm_1.getRepository)(AuditTrail_1.AuditTrail);
    }
    getLogs(filters) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const [items, total] = yield query.getManyAndCount();
            return {
                items,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        });
    }
    getLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.auditTrailRepository.findOne({ where: { id } });
        });
    }
    getLogsByEntity(entityName, entityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.auditTrailRepository.find({
                where: { entityName, entityId },
                order: { createdAt: "DESC" }
            });
        });
    }
}
exports.AuditTrailService = AuditTrailService;
