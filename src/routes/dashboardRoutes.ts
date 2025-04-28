import express, {RequestHandler} from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/stock-summary", authorize("admin", "accountant", "manager", "sales", "purchase"), DashboardController.stockSummary);
router.get("/finance-summary",authorize("admin", "accountant", "manager", "sales", "purchase"), DashboardController.financeSummary);

export default router;
