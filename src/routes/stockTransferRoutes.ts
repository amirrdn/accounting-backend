import express, {RequestHandler} from "express";
import { StockTransferController } from "../controllers/StockTransferController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await StockTransferController.create(req, res);
};

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await StockTransferController.getAll(req, res);
};

const exportPDFHandler: RequestHandler = async (req, res): Promise<void> => {
  await StockTransferController.exportPDF(req, res);
};

const exportExcelHandler: RequestHandler = async (req, res): Promise<void> => {
  await StockTransferController.exportExcel(req, res);
};

router.post("/stock-transfer", authorize("admin", "finance"), createHandler);
router.get("/stock-transfer", authorize("admin", "finance"), getAllHandler);
router.get("/stock-transfer/:id/pdf", authorize("admin", "finance"), exportPDFHandler);
router.get("/stock-transfer/:id/excel", authorize("admin", "finance"), exportExcelHandler);
router.post("/stock-transfer/:id/receive", authorize("admin", "finance"), createHandler);

export default router;
