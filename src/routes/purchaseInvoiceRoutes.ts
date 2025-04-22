import express, { RequestHandler } from "express";
import { PurchaseInvoiceController } from "../controllers/PurchaseInvoiceController";
import { authenticate } from "../middleware/auth";
import multer from "multer";
import path from "path";

const router = express.Router();
const controller = new PurchaseInvoiceController();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
    await authenticate(req, res, next);
};

router.post("/", authMiddleware, upload.single('file'), (req, res) => controller.createPurchaseInvoice(req, res));

router.put("/:id", authMiddleware, upload.single('file'), (req, res) => controller.updatePurchaseInvoice(req, res));

router.get("/", authMiddleware, (req, res) => controller.getPurchaseInvoices(req, res));

router.get("/:id", (req, res) => controller.getPurchaseInvoiceById(req, res));

router.patch("/:id/status", authMiddleware, (req, res) => controller.updatePurchaseInvoiceStatus(req, res));

router.delete("/:id", authMiddleware, (req, res) => controller.deletePurchaseInvoice(req, res));

export default router;
