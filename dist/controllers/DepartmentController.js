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
exports.DepartmentController = void 0;
const DepartmentService_1 = require("../services/DepartmentService");
class DepartmentController {
    constructor() {
        this.departmentService = new DepartmentService_1.DepartmentService();
    }
    getAllDepartments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield this.departmentService.findAll();
                res.status(200).json(departments);
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengambil data departemen", error });
            }
        });
    }
    getDepartmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const department = yield this.departmentService.findById(id);
                if (department) {
                    res.status(200).json(department);
                }
                else {
                    res.status(404).json({ message: "Departemen tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengambil data departemen", error });
            }
        });
    }
    createDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentData = req.body;
                const newDepartment = yield this.departmentService.create(departmentData);
                res.status(201).json(newDepartment);
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat membuat departemen", error });
            }
        });
    }
    updateDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const departmentData = req.body;
                const updatedDepartment = yield this.departmentService.update(id, departmentData);
                if (updatedDepartment) {
                    res.status(200).json(updatedDepartment);
                }
                else {
                    res.status(404).json({ message: "Departemen tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengupdate departemen", error });
            }
        });
    }
    deleteDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.departmentService.delete(id);
                if (success) {
                    res.status(200).json({ message: "Departemen berhasil dihapus" });
                }
                else {
                    res.status(404).json({ message: "Departemen tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat menghapus departemen", error });
            }
        });
    }
}
exports.DepartmentController = DepartmentController;
