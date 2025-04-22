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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditTrailMiddleware = void 0;
const typeorm_1 = require("typeorm");
const AuditTrail_1 = require("../entity/AuditTrail");
const logger_1 = __importDefault(require("../utils/logger"));
const auditTrailMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const originalJson = res.json;
    res.json = function (data) {
        var _a, _b, _c;
        res.json = originalJson;
        if (req.method !== 'GET') {
            const auditTrail = new AuditTrail_1.AuditTrail();
            auditTrail.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            auditTrail.action = req.method === 'POST' ? 'CREATE' :
                req.method === 'PUT' || req.method === 'PATCH' ? 'UPDATE' :
                    req.method === 'DELETE' ? 'DELETE' : 'OTHER';
            auditTrail.entityName = req.path.split('/')[1];
            auditTrail.entityId = (_b = req.params.id) !== null && _b !== void 0 ? _b : '';
            auditTrail.newValues = req.method !== 'DELETE' ? req.body : null;
            auditTrail.ipAddress = req.ip || 'unknown';
            auditTrail.userAgent = (_c = req.get('user-agent')) !== null && _c !== void 0 ? _c : '';
            (0, typeorm_1.getConnection)()
                .getRepository(AuditTrail_1.AuditTrail)
                .save(auditTrail)
                .catch(error => {
                logger_1.default.error('Failed to save audit trail', {
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
});
exports.auditTrailMiddleware = auditTrailMiddleware;
