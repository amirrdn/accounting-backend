import express, { RequestHandler } from "express";
import { AuthController } from "../controllers/AuthController";

const router = express.Router();

const registerHandler: RequestHandler = async (req, res): Promise<void> => {
  await AuthController.register(req, res);
};

const loginHandler: RequestHandler = async (req, res): Promise<void> => {
  await AuthController.login(req, res);
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);

export default router;
