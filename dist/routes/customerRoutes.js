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
const CustomerController_1 = require("../controllers/CustomerController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.use(authMiddleware);
const getAllHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield CustomerController_1.CustomerController.getAll(req, res);
});
const getByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield CustomerController_1.CustomerController.getById(req, res);
});
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield CustomerController_1.CustomerController.create(req, res);
});
const updateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield CustomerController_1.CustomerController.update(req, res);
});
const deleteHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield CustomerController_1.CustomerController.delete(req, res);
});
router.get("/", getAllHandler);
router.get("/:id", getByIdHandler);
router.post("/", (0, role_1.authorize)("admin", "sales"), createHandler);
router.put("/:id", (0, role_1.authorize)("admin", "sales"), updateHandler);
router.patch("/:id", (0, role_1.authorize)("admin", "sales"), updateHandler);
router.delete("/:id", (0, role_1.authorize)("admin"), deleteHandler);
exports.default = router;
