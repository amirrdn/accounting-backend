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
const PettyCashController_1 = require("../controllers/PettyCashController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
const controller = new PettyCashController_1.PettyCashController();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.use(authMiddleware);
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.create(req, res);
});
const getAllHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.getAll(req, res);
});
const getByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.getById(req, res);
});
const approveHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.approve(req, res);
});
const rejectHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.reject(req, res);
});
const getBalanceHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.getBalance(req, res);
});
router.post("/", (0, role_1.authorize)("admin", "finance"), createHandler);
router.get("/", getAllHandler);
router.get("/balance", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/:id/approve", (0, role_1.authorize)("admin", "finance_manager"), approveHandler);
router.post("/:id/reject", (0, role_1.authorize)("admin", "finance_manager"), rejectHandler);
exports.default = router;
