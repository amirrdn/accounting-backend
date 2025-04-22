import express, { RequestHandler } from "express";
import { PurchaseOrderController } from "../controllers/purchaseOrderController";
import { authenticate } from "../middleware/auth";
import multer from "multer";
import { authorize } from "../middleware/role";

const router = express.Router();
const purchaseOrderController = new PurchaseOrderController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.post("/", authMiddleware, upload.single('file'), purchaseOrderController.createPurchaseOrder);

router.get("/", authMiddleware, purchaseOrderController.getPurchaseOrders);

router.get("/:id", authMiddleware, purchaseOrderController.getPurchaseOrderById);

router.patch("/:id/status", authMiddleware, authorize("admin", "manager"), purchaseOrderController.updatePurchaseOrderStatus);

router.delete("/:id", authMiddleware, purchaseOrderController.deletePurchaseOrder);

export default router; 