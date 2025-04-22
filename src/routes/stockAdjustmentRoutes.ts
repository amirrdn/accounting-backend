import express, { RequestHandler } from "express";
import { StockAdjustmentController } from "../controllers/StockAdjustmentController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const adjustStockHandler: RequestHandler = async (req, res): Promise<void> => {
  await StockAdjustmentController.adjustStock(req, res);
};

const listAdjustmentsHandler: RequestHandler = async (req, res): Promise<void> => {
  await StockAdjustmentController.listAdjustments(req, res);
};

router.post("/stock-adjustment", authorize("admin", "finance"), adjustStockHandler);
router.get("/stock-adjustment", authorize("admin", "finance"), listAdjustmentsHandler);
router.post("/stock-adjustment/:id/approve", authorize("admin", "finance"), StockAdjustmentController.approve);

export default router;
