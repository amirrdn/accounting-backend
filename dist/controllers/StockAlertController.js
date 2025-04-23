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
exports.StockAlertController = void 0;
const StockAlertService_1 = require("../services/StockAlertService");
class StockAlertController {
    static getAlerts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield StockAlertService_1.StockAlertService.getLowStockProducts();
                res.json(data);
            }
            catch (err) {
                res.status(500).json({ message: "Gagal mengambil data stok minimum", error: err });
            }
        });
    }
}
exports.StockAlertController = StockAlertController;
