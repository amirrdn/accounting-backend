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
exports.AccountSettingController = void 0;
const AccountSettingService_1 = require("../services/AccountSettingService");
class AccountSettingController {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield AccountSettingService_1.AccountSettingService.get();
            res.json(data);
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield AccountSettingService_1.AccountSettingService.update(req.body);
            res.json(data);
        });
    }
}
exports.AccountSettingController = AccountSettingController;
