import express, { RequestHandler } from "express";
import { AccountSettingController } from "../controllers/AccountSettingController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const getHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountSettingController.get(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountSettingController.update(req, res);
};

router.get("/", getHandler);
router.put("/", authorize("admin"), updateHandler);

export default router;
