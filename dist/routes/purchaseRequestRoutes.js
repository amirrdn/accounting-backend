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
const PurchaseRequestController_1 = require("../controllers/PurchaseRequestController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
const purchaseRequestController = new PurchaseRequestController_1.PurchaseRequestController();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.use(authMiddleware);
router.get("/", (0, role_1.authorize)("admin", "purchase", "manager", "finance"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.findAll(req, res);
}));
router.get("/:id", (0, role_1.authorize)("admin", "purchase", "manager", "finance"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.findById(req, res);
}));
router.post("/", (0, role_1.authorize)("admin", "purchase", "manager", "finance"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.create(req, res);
}));
router.put("/:id", (0, role_1.authorize)("admin", "purchase", "manager", "finance"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.update(req, res);
}));
router.delete("/:id", (0, role_1.authorize)("admin", "purchase", "manager", "finance"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.delete(req, res);
}));
router.post("/:id/approve", (0, role_1.authorize)("admin", "manager"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.approve(req, res);
}));
router.post("/:id/reject", (0, role_1.authorize)("admin", "manager"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseRequestController.reject(req, res);
}));
exports.default = router;
