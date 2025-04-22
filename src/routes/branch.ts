import { Router, RequestHandler } from "express";
import { BranchController } from "../controllers/BranchController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();
const branchController = new BranchController();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const createHandler: RequestHandler = async (req, res) => {
  await branchController.create(req, res);
};

const findAllHandler: RequestHandler = async (req, res) => {
  await branchController.findAll(req, res);
};

const findOneHandler: RequestHandler = async (req, res) => {
  await branchController.findOne(req, res);
};

const updateHandler: RequestHandler = async (req, res) => {
  await branchController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res) => {
  await branchController.delete(req, res);
};

const getBranchReportHandler: RequestHandler = async (req, res) => {
  await branchController.getBranchReport(req, res);
};

const getConsolidatedReportHandler: RequestHandler = async (req, res) => {
  await branchController.getConsolidatedReport(req, res);
};

router.post("/", authorize("admin"), createHandler);
router.get("/", authorize("admin", "accountant", "purchase", "finance"), findAllHandler);
router.get("/:id", authorize("user"), findOneHandler);
router.put("/:id", authorize("admin"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

router.get("/:branchId/report", authorize("user"), getBranchReportHandler);
router.get("/report/consolidated", authorize("user"), getConsolidatedReportHandler);

export default router; 