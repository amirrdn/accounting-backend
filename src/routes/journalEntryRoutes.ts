import express, { RequestHandler } from "express";
import { JournalEntryController } from "../controllers/JournalEntryController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = express.Router();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
  await authenticate(req, res, next);
};

router.use(authMiddleware);

const getAllHandler: RequestHandler = async (req, res): Promise<void> => {
  await JournalEntryController.getAll(req, res);
};

const getByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  await JournalEntryController.getById(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await JournalEntryController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await JournalEntryController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await JournalEntryController.delete(req, res);
};

router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", authorize("admin", "accounting"), createHandler);
router.put("/:id", authorize("admin", "accounting"), updateHandler);
router.delete("/:id", authorize("admin"), deleteHandler);

export default router;
