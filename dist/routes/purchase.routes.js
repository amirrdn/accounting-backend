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
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const purchaseReceiptController_1 = require("../controllers/purchaseReceiptController");
const purchasePaymentRoutes_1 = __importDefault(require("./purchasePaymentRoutes"));
const router = (0, express_1.Router)();
const purchaseReceiptController = new purchaseReceiptController_1.PurchaseReceiptController();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.post('/receipts', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.createReceipt.bind(purchaseReceiptController));
router.get('/receipts', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.getReceipts.bind(purchaseReceiptController));
router.get('/receipts/:id', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.getReceiptById.bind(purchaseReceiptController));
router.put('/receipts/:id', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.updateReceipt.bind(purchaseReceiptController));
router.delete('/receipts/:id', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.deleteReceipt.bind(purchaseReceiptController));
router.patch('/receipts/:id/status', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.updateReceiptStatus.bind(purchaseReceiptController));
router.get('/receipts/filter', authMiddleware, (0, role_1.authorize)('admin', 'manager', 'purchase', 'finance'), purchaseReceiptController.filterReceipts.bind(purchaseReceiptController));
router.use('/payments', purchasePaymentRoutes_1.default);
exports.default = router;
