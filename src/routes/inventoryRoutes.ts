import express, { RequestHandler } from "express";
import { InventoryController } from "../controllers/InventoryController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/stocks", authorize("admin", "finance"), InventoryController.getStocks);

export default router; 