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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BranchController_1 = require("../controllers/BranchController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = (0, express_1.Router)();
const branchController = new BranchController_1.BranchController();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticate)(req, res, next);
});
router.use(authMiddleware);
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.create(req, res);
});
const findAllHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.findAll(req, res);
});
const findOneHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.findOne(req, res);
});
const updateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.update(req, res);
});
const deleteHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.delete(req, res);
});
const getBranchReportHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.getBranchReport(req, res);
});
const getConsolidatedReportHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield branchController.getConsolidatedReport(req, res);
});
router.post("/", (0, role_1.authorize)("admin"), createHandler);
router.get("/", (0, role_1.authorize)("admin", "accountant", "purchase", "finance"), findAllHandler);
router.get("/:id", (0, role_1.authorize)("user"), findOneHandler);
router.put("/:id", (0, role_1.authorize)("admin"), updateHandler);
router.delete("/:id", (0, role_1.authorize)("admin"), deleteHandler);
router.get("/:branchId/report", (0, role_1.authorize)("user"), getBranchReportHandler);
router.get("/report/consolidated", (0, role_1.authorize)("user"), getConsolidatedReportHandler);
exports.default = router;
