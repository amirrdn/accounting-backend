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
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
class ProductController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? parseInt(req.query.page) : undefined;
                const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                const result = yield ProductService_1.ProductService.getAll(page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengambil data produk", error });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const product = yield ProductService_1.ProductService.getById(id);
                if (product) {
                    res.status(200).json(product);
                }
                else {
                    res.status(404).json({ message: "Produk tidak ditemukan" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan saat mengambil data produk", error });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ProductService_1.ProductService.create(req.body);
                res.status(201).json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "PRODUCT_CREATE_ERROR",
                    message: error.message || "Terjadi kesalahan saat membuat produk"
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ProductService_1.ProductService.update(+req.params.id, req.body);
                if (!data) {
                    return res.status(404).json({
                        status: "error",
                        code: "PRODUCT_NOT_FOUND",
                        message: "Produk tidak ditemukan"
                    });
                }
                res.json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "PRODUCT_UPDATE_ERROR",
                    message: error.message || "Terjadi kesalahan saat mengupdate produk"
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ProductService_1.ProductService.delete(+req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    code: "PRODUCT_DELETE_ERROR",
                    message: "Terjadi kesalahan saat menghapus produk"
                });
            }
        });
    }
}
exports.ProductController = ProductController;
