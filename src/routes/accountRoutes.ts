import express, { RequestHandler } from "express";
import { AccountController } from "../controllers/AccountController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);
const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountController.getById(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await AccountController.delete(req, res);
};

router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", authorize("admin", "accountant"), createHandler);
router.put("/:id", authorize("admin", "accountant"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

export default router;
