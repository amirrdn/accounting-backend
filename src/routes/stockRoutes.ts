import express, {RequestHandler} from "express";
import { StockController } from "../controllers/StockController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/stock/:productId", authorize("admin", "finance"), StockController.getCurrentStock);
router.get("/stock-card/:productId", authorize("admin", "finance"), StockController.getStockCard);

export default router;
