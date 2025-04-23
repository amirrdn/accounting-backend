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
exports.SupplierController = void 0;
const SupplierService_1 = require("../services/SupplierService");
class SupplierController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield SupplierService_1.SupplierService.getAll();
            res.json(data);
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield SupplierService_1.SupplierService.getById(+req.params.id);
            if (!data)
                return res.status(404).json({ message: "Supplier not found" });
            res.json(data);
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield SupplierService_1.SupplierService.create(req.body);
            res.status(201).json(data);
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield SupplierService_1.SupplierService.update(+req.params.id, req.body);
            res.json(data);
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SupplierService_1.SupplierService.delete(+req.params.id);
            res.status(204).send();
        });
    }
}
exports.SupplierController = SupplierController;
