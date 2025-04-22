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
exports.WarehouseController = void 0;
const WarehouseService_1 = require("../services/WarehouseService");
class WarehouseController {
    constructor() {
        this.warehouseService = new WarehouseService_1.WarehouseService();
    }
    getAllWarehouses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouses = yield this.warehouseService.findAll();
                res.status(200).json(warehouses);
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengambil data gudang", error });
            }
        });
    }
    getWarehouseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const warehouse = yield this.warehouseService.findById(id);
                if (warehouse) {
                    res.status(200).json(warehouse);
                }
                else {
                    res.status(404).json({ message: "Gudang tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengambil data gudang", error });
            }
        });
    }
    createWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouseData = req.body;
                const newWarehouse = yield this.warehouseService.create(warehouseData);
                res.status(201).json(newWarehouse);
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat membuat gudang", error });
            }
        });
    }
    updateWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const warehouseData = req.body;
                const updatedWarehouse = yield this.warehouseService.update(id, warehouseData);
                if (updatedWarehouse) {
                    res.status(200).json(updatedWarehouse);
                }
                else {
                    res.status(404).json({ message: "Gudang tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengupdate gudang", error });
            }
        });
    }
    deleteWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.warehouseService.delete(id);
                if (success) {
                    res.status(200).json({ message: "Gudang berhasil dihapus" });
                }
                else {
                    res.status(404).json({ message: "Gudang tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat menghapus gudang", error });
            }
        });
    }
}
exports.WarehouseController = WarehouseController;
