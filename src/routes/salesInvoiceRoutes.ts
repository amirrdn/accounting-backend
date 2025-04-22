import express, { RequestHandler } from "express";
import { SalesInvoiceController } from "../controllers/SalesInvoiceController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await SalesInvoiceController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await SalesInvoiceController.getById(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await SalesInvoiceController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await SalesInvoiceController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await SalesInvoiceController.delete(req, res);
};

router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", authorize("admin", "sales"), createHandler);
router.put("/:id", authorize("admin", "sales"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

export default router;
