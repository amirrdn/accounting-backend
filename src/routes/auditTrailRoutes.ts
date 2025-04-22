import express, { RequestHandler } from "express";
import { AuditTrailController } from "../controllers/auditTrailController";

const router = express.Router();

const getLogsHandler: RequestHandler = async (req, res): Promise<void> => {
    await AuditTrailController.prototype.getLogs(req, res);
};

const getLogByIdHandler: RequestHandler = async (req, res): Promise<void> => {
    await AuditTrailController.prototype.getLogById(req, res);
};

const getLogsByEntityHandler: RequestHandler = async (req, res): Promise<void> => {
    await AuditTrailController.prototype.getLogsByEntity(req, res);
};

router.get("/", getLogsHandler);
router.get("/:id", getLogByIdHandler);
router.get("/entity/:entityName/:entityId", getLogsByEntityHandler);

export default router; 