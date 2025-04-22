import express, { RequestHandler } from "express";
import { PettyCashController } from "../controllers/PettyCashController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();
const controller = new PettyCashController();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await controller.create(req, res);
};

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await controller.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await controller.getById(req, res);
};

const approveHandler: RequestHandler = async (req, res): Promise<void> => {
  await controller.approve(req, res);
};

const rejectHandler: RequestHandler = async (req, res): Promise<void> => {
  await controller.reject(req, res);
};

const getBalanceHandler: RequestHandler = async (req, res): Promise<void> => {
  await controller.getBalance(req, res);
};

router.post("/", authorize("admin", "finance"), createHandler);
router.get("/", getAllHandler);
router.get("/balance", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/:id/approve", authorize("admin", "finance_manager"), approveHandler);
router.post("/:id/reject", authorize("admin", "finance_manager"), rejectHandler);

export default router; 