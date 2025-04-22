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
exports.generatePaymentNumber = generatePaymentNumber;
const data_source_1 = require("../data-source");
const PurchasePayment_1 = require("../entity/PurchasePayment");
function generatePaymentNumber(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const repository = data_source_1.AppDataSource.getRepository(PurchasePayment_1.PurchasePayment);
        const lastPayment = yield repository
            .createQueryBuilder("payment")
            .where("payment.paymentNumber LIKE :prefix", { prefix: `${prefix}${year}${month}%` })
            .orderBy("payment.paymentNumber", "DESC")
            .getOne();
        const currentNumber = lastPayment
            ? parseInt(lastPayment.paymentNumber.slice(-4)) + 1
            : 1;
        return `${prefix}${year}${month}${currentNumber.toString().padStart(4, '0')}`;
    });
}
