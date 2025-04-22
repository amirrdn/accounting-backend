import express, {RequestHandler} from "express";
import { ProductionController } from "../controllers/ProductionController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.post("/", authorize("admin", "accountant"), ProductionController.create);

export default router;
