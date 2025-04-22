import express, {RequestHandler} from "express";
import { AutoPurchaseOrderController } from "../controllers/AutoPurchaseOrderController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/draft-purchase-order", authorize("admin", "accountant"), AutoPurchaseOrderController.getDraftPO);
router.post("/draft-purchase-order", authorize("admin", "accountant"), AutoPurchaseOrderController.createPO);

export default router;
