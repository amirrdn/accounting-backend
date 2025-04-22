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
exports.JournalEntryController = void 0;
const JournalEntryService_1 = require("../services/JournalEntryService");
class JournalEntryController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield JournalEntryService_1.JournalEntryService.getAll();
                res.json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    code: "JOURNAL_ENTRY_GET_ALL_ERROR",
                    message: "Terjadi kesalahan saat mengambil data journal entry"
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield JournalEntryService_1.JournalEntryService.getById(+req.params.id);
                if (!data) {
                    return res.status(404).json({
                        status: "error",
                        code: "JOURNAL_ENTRY_NOT_FOUND",
                        message: "Journal entry tidak ditemukan"
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
                    code: "JOURNAL_ENTRY_GET_BY_ID_ERROR",
                    message: "Terjadi kesalahan saat mengambil data journal entry"
                });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield JournalEntryService_1.JournalEntryService.create(req.body);
                res.status(201).json({
                    status: "success",
                    data: data
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    code: "JOURNAL_ENTRY_CREATE_ERROR",
                    message: error.message || "Terjadi kesalahan saat membuat journal entry"
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield JournalEntryService_1.JournalEntryService.update(+req.params.id, req.body);
                if (!data) {
                    return res.status(404).json({
                        status: "error",
                        code: "JOURNAL_ENTRY_NOT_FOUND",
                        message: "Journal entry tidak ditemukan"
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
                    code: "JOURNAL_ENTRY_UPDATE_ERROR",
                    message: error.message || "Terjadi kesalahan saat mengupdate journal entry"
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield JournalEntryService_1.JournalEntryService.delete(+req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    code: "JOURNAL_ENTRY_DELETE_ERROR",
                    message: "Terjadi kesalahan saat menghapus journal entry"
                });
            }
        });
    }
}
exports.JournalEntryController = JournalEntryController;
