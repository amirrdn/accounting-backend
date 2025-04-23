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
exports.AccountSettingService = void 0;
const data_source_1 = require("../data-source");
const AccountSetting_1 = require("../entity/AccountSetting");
const repo = data_source_1.AppDataSource.getRepository(AccountSetting_1.AccountSetting);
class AccountSettingService {
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            let setting = yield repo.findOne({
                relations: ["salesAccount", "receivableAccount", "purchaseAccount", "payableAccount", "expenseAccount", "cashAccount"],
            });
            if (!setting) {
                setting = yield repo.save(repo.create());
            }
            return setting;
        });
    }
    static update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield this.get();
            repo.merge(current, data);
            return repo.save(current);
        });
    }
}
exports.AccountSettingService = AccountSettingService;
