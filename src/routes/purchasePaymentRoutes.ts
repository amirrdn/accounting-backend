import { Router, RequestHandler } from "express";
import { PurchasePaymentController } from "../controllers/PurchasePaymentController";
import { authenticate } from "../middleware/auth";

const router = Router();
const controller = new PurchasePaymentController();

router.use(authenticate as RequestHandler);

router.get("/", controller.getAll.bind(controller) as RequestHandler);

router.get("/:id", controller.getById.bind(controller) as RequestHandler);

router.post("/", controller.create.bind(controller) as RequestHandler);

router.patch("/:id", controller.update.bind(controller) as RequestHandler);

router.delete("/:id", controller.delete.bind(controller) as RequestHandler);

router.get("/unpaid-invoices/:supplierId", controller.getUnpaidInvoices.bind(controller) as RequestHandler);

router.get("/generate-number", controller.generatePaymentNumber.bind(controller) as RequestHandler);

export default router; 