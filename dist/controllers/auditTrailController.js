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
exports.AuditTrailController = void 0;
const auditTrailService_1 = require("../services/auditTrailService");
class AuditTrailController {
    constructor() {
        this.auditTrailService = new auditTrailService_1.AuditTrailService();
    }
    getLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {
                    startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                    endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                    userId: req.query.userId ? parseInt(req.query.userId) : undefined,
                    action: req.query.action,
                    entityName: req.query.entityName,
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    limit: req.query.limit ? parseInt(req.query.limit) : 10
                };
                const logs = yield this.auditTrailService.getLogs(filters);
                return res.json(logs);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Error saat mengambil data audit log: " + error.message
                });
            }
        });
    }
    getLogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const log = yield this.auditTrailService.getLogById(id);
                if (!log) {
                    return res.status(404).json({
                        status: 404,
                        message: "Audit log tidak ditemukan"
                    });
                }
                return res.json(log);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Error saat mengambil data audit log: " + error.message
                });
            }
        });
    }
    getLogsByEntity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { entityName, entityId } = req.params;
                const logs = yield this.auditTrailService.getLogsByEntity(entityName, entityId);
                return res.json(logs);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Error saat mengambil data entity log: " + error.message
                });
            }
        });
    }
}
exports.AuditTrailController = AuditTrailController;
