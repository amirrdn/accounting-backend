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
exports.AccountController = void 0;
const AccountService_1 = require("../services/AccountService");
class AccountController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield AccountService_1.AccountService.getAll(page, limit);
                res.json({
                    status: "success",
                    data: result.data,
                    meta: {
                        total: result.total,
                        page: page,
                        limit: limit,
                        totalPages: Math.ceil(result.total / limit)
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Terjadi kesalahan saat mengambil data"
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield AccountService_1.AccountService.getById(+req.params.id);
                if (!data) {
                    return res.status(404).json({
                        status: "error",
                        message: "Account not found"
                    });
                }
                res.json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Terjadi kesalahan saat mengambil data"
                });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield AccountService_1.AccountService.create(req.body);
                res.status(201).json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Terjadi kesalahan saat membuat data"
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield AccountService_1.AccountService.update(+req.params.id, req.body);
                if (!data) {
                    return res.status(404).json({
                        status: "error",
                        message: "Account not found"
                    });
                }
                res.json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Terjadi kesalahan saat memperbarui data"
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield AccountService_1.AccountService.delete(+req.params.id);
                if (result.affected === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "Account not found"
                    });
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Terjadi kesalahan saat menghapus data"
                });
            }
        });
    }
}
exports.AccountController = AccountController;
