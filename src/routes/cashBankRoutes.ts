import express, {RequestHandler} from "express";
import { CashBankController } from "../controllers/CashBankController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.post("/transfer", authorize("admin", "finance"), CashBankController.transfer);
router.post("/in", authorize("admin", "finance"), CashBankController.cashIn);
router.post("/out", authorize("admin", "finance"), CashBankController.cashOut);
router.get("/transactions", authorize("admin", "finance"), CashBankController.list);
router.get("/cashflow", authorize("admin", "finance"), CashBankController.cashFlow);
router.post("/approve/:id", authorize("admin", "finance"), CashBankController.approve);

export default router;
