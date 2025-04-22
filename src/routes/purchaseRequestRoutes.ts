import express, { RequestHandler } from "express";
import { PurchaseRequestController } from "../controllers/PurchaseRequestController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";
import { PurchaseRequestStatus } from "../entity/PurchaseRequest";

const router = express.Router();
const purchaseRequestController = new PurchaseRequestController();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/", authorize("admin", "purchase", "manager", "finance"), async (req, res) => {
  await purchaseRequestController.findAll(req, res);
});

router.get("/:id", authorize("admin", "purchase", "manager", "finance"), async (req, res) => {
  await purchaseRequestController.findById(req, res);
});

router.post("/", authorize("admin", "purchase", "manager", "finance"), async (req, res) => {
  await purchaseRequestController.create(req, res);
});

router.put("/:id", authorize("admin", "purchase", "manager", "finance"), async (req, res) => {
  await purchaseRequestController.update(req, res);
});

router.delete("/:id", authorize("admin", "purchase", "manager", "finance"), async (req, res) => {
  await purchaseRequestController.delete(req, res);
});

router.post("/:id/approve", authorize("admin", "manager"), async (req, res) => {
  await purchaseRequestController.approve(req, res);
});

router.post("/:id/reject", authorize("admin", "manager"), async (req, res) => {
  await purchaseRequestController.reject(req, res);
});

export default router; 