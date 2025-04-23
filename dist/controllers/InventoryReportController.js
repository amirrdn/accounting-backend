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
exports.InventoryReportController = void 0;
const InventoryReportService_1 = require("../services/InventoryReportService");
class InventoryReportController {
    static getInventoryValue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield InventoryReportService_1.InventoryReportService.getInventoryValueReport();
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ message: "Gagal mengambil laporan persediaan", error });
            }
        });
    }
}
exports.InventoryReportController = InventoryReportController;
