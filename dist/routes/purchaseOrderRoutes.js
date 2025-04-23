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
const purchaseOrderController_1 = require("../controllers/purchaseOrderController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
const purchaseOrderController = new purchaseOrderController_1.PurchaseOrderController();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.post("/", authMiddleware, upload.single('file'), purchaseOrderController.createPurchaseOrder);
router.get("/", authMiddleware, purchaseOrderController.getPurchaseOrders);
router.get("/:id", authMiddleware, purchaseOrderController.getPurchaseOrderById);
router.patch("/:id/status", authMiddleware, (0, role_1.authorize)("admin", "manager"), purchaseOrderController.updatePurchaseOrderStatus);
router.delete("/:id", authMiddleware, purchaseOrderController.deletePurchaseOrder);
exports.default = router;
