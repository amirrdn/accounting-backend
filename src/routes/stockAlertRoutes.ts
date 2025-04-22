import express, {RequestHandler} from "express";
import { StockAlertController } from "../controllers/StockAlertController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/stock-alert", authorize("admin", "finance"), StockAlertController.getAlerts);

export default router;
