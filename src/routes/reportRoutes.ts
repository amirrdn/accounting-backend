import express, { RequestHandler } from "express";
import { LedgerController } from "../controllers/LedgerController";
import { BalanceSheetController } from "../controllers/BalanceSheetController";
import { IncomeStatementController } from "../controllers/IncomeStatementController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/ledger/:accountId", authorize("admin", "accountant"), LedgerController.getGeneralLedger);

router.get("/balance-sheet", authorize("admin", "accountant"), BalanceSheetController.getBalanceSheet);

router.get("/income-statement", authorize("admin", "accountant"), IncomeStatementController.getIncomeStatement);

export default router;