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
const BudgetController_1 = require("../controllers/BudgetController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
const budgetController = new BudgetController_1.BudgetController();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.use(authMiddleware);
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.create(req, res);
});
const getAllHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.getAll(req, res);
});
const getByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.getById(req, res);
});
const deleteHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.delete(req, res);
});
const getReportHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.getBudgetReport(req, res);
});
const createDetailHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.createDetail(req, res);
});
const deleteDetailHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield budgetController.deleteDetail(req, res);
});
router.post("/", (0, role_1.authorize)("admin", "finance"), createHandler);
router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.delete("/:id", (0, role_1.authorize)("admin", "finance"), deleteHandler);
router.get("/report/:year", getReportHandler);
router.post("/:id/details", (0, role_1.authorize)("admin", "finance"), createDetailHandler);
router.delete("/:id/details/:detailId", (0, role_1.authorize)("admin", "finance"), deleteDetailHandler);
exports.default = router;
