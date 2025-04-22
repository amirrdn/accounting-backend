"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PurchaseInvoiceController_1 = require("../controllers/PurchaseInvoiceController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const controller = new PurchaseInvoiceController_1.PurchaseInvoiceController();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.post("/", authMiddleware, upload.single('file'), (req, res) => controller.createPurchaseInvoice(req, res));
router.put("/:id", authMiddleware, upload.single('file'), (req, res) => controller.updatePurchaseInvoice(req, res));
router.get("/", authMiddleware, (req, res) => controller.getPurchaseInvoices(req, res));
router.get("/:id", (req, res) => controller.getPurchaseInvoiceById(req, res));
router.patch("/:id/status", authMiddleware, (req, res) => controller.updatePurchaseInvoiceStatus(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.deletePurchaseInvoice(req, res));
exports.default = router;
