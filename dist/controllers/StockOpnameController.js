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
exports.StockOpnameController = void 0;
const StockOpnameService_1 = require("../services/StockOpnameService");
const data_source_1 = require("../data-source");
const StockOpname_1 = require("../entity/StockOpname");
class StockOpnameController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { warehouseId, items } = req.body;
            const result = yield StockOpnameService_1.StockOpnameService.createStockOpname(warehouseId, items);
            res.json(result);
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield data_source_1.AppDataSource.getRepository(StockOpname_1.StockOpname).find({
                    relations: ["warehouse", "items", "items.product"],
                    order: { date: "DESC" }
                });
                res.json(data);
            }
            catch (err) {
                res.status(500).json({ message: "Gagal mengambil data stock opname", error: err });
            }
        });
    }
}
exports.StockOpnameController = StockOpnameController;
