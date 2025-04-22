import express, { RequestHandler } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();
const budgetController = new BudgetController();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.create(req, res);
};

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.getById(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.delete(req, res);
};

const getReportHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.getBudgetReport(req, res);
};

const createDetailHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.createDetail(req, res);
};

const deleteDetailHandler: RequestHandler = async (req, res): Promise<void> => {
  await budgetController.deleteDetail(req, res);
};

router.post("/", authorize("admin", "finance"), createHandler);
router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.delete("/:id", authorize("admin", "finance"), deleteHandler);
router.get("/report/:year", getReportHandler);
router.post("/:id/details", authorize("admin", "finance"), createDetailHandler);
router.delete("/:id/details/:detailId", authorize("admin", "finance"), deleteDetailHandler);

export default router; 