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
exports.BalanceSheetController = void 0;
const BalanceSheetService_1 = require("../services/BalanceSheetService");
class BalanceSheetController {
    static getBalanceSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const endDate = new Date(req.query.end || new Date());
                const result = yield BalanceSheetService_1.BalanceSheetService.getBalanceSheet(endDate);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to get balance sheet", error });
            }
        });
    }
}
exports.BalanceSheetController = BalanceSheetController;
