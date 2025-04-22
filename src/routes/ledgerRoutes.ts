import express, { RequestHandler } from "express";
import { LedgerController } from "../controllers/LedgerController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/ledger/:accountId", authorize("admin", "accountant"), LedgerController.getGeneralLedger);

export default router;
