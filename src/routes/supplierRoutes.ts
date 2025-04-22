import express, { RequestHandler } from "express";
import { SupplierController } from "../controllers/SupplierController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await SupplierController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await SupplierController.getById(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await SupplierController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await SupplierController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await SupplierController.delete(req, res);
};

router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", authorize("admin", "purchasing"), createHandler);
router.put("/:id", authorize("admin", "purchasing"), updateHandler);
router.patch("/:id", authorize("admin", "purchasing"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

export default router;
