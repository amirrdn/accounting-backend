import express, { RequestHandler } from "express";
import { InventoryReportController } from "../controllers/InventoryReportController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/inventory-report", InventoryReportController.getInventoryValue);

export default router;
