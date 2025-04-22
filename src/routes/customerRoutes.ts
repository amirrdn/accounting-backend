import express, { RequestHandler } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await CustomerController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await CustomerController.getById(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await CustomerController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await CustomerController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await CustomerController.delete(req, res);
};

router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", authorize("admin", "sales"), createHandler);
router.put("/:id", authorize("admin", "sales"), updateHandler);
router.patch("/:id", authorize("admin", "sales"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

export default router;
