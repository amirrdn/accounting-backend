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
exports.BranchController = void 0;
const BranchService_1 = require("../services/BranchService");
class BranchController {
    constructor() {
        this.branchService = new BranchService_1.BranchService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branch = yield this.branchService.create(req.body);
                return res.status(201).json(branch);
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating branch", error });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branches = yield this.branchService.findAll();
                return res.json(branches);
            }
            catch (error) {
                return res.status(500).json({ message: "Error fetching branches", error });
            }
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branch = yield this.branchService.findOne(parseInt(req.params.id));
                if (!branch) {
                    return res.status(404).json({ message: "Branch not found" });
                }
                return res.json(branch);
            }
            catch (error) {
                return res.status(500).json({ message: "Error fetching branch", error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branch = yield this.branchService.update(parseInt(req.params.id), req.body);
                if (!branch) {
                    return res.status(404).json({ message: "Branch not found" });
                }
                return res.json(branch);
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating branch", error });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.branchService.delete(parseInt(req.params.id));
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).json({ message: "Error deleting branch", error });
            }
        });
    }
    getBranchReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branchId } = req.params;
                const { startDate, endDate } = req.query;
                const report = yield this.branchService.getTransactionsByBranch(parseInt(branchId), new Date(startDate), new Date(endDate));
                return res.json(report);
            }
            catch (error) {
                return res.status(500).json({ message: "Error generating branch report", error });
            }
        });
    }
    getConsolidatedReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const report = yield this.branchService.getConsolidatedReport(new Date(startDate), new Date(endDate));
                return res.json(report);
            }
            catch (error) {
                return res.status(500).json({ message: "Error generating consolidated report", error });
            }
        });
    }
}
exports.BranchController = BranchController;
