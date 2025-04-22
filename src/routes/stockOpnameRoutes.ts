import express, {RequestHandler} from "express";
import { StockOpnameController } from "../controllers/StockOpnameController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

router.get("/", authorize("admin", "finance"), StockOpnameController.getAll);
router.post("/", authorize("admin", "finance"), StockOpnameController.create);

export default router;
