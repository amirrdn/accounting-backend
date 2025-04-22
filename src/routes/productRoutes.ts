import express, { RequestHandler } from "express";
import { ProductController } from "../controllers/ProductController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await ProductController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await ProductController.getById(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await ProductController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await ProductController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await ProductController.delete(req, res);
};

router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", authorize("admin", "inventory"), createHandler);
router.patch("/:id", authorize("admin", "inventory"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

export default router;
