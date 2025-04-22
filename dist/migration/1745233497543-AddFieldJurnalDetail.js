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
exports.AddFieldJurnalDetail1745233497543 = void 0;
const typeorm_1 = require("typeorm");
class AddFieldJurnalDetail1745233497543 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("journal_detail", new typeorm_1.TableColumn({
                name: "description",
                type: "text",
                isNullable: true,
            }));
            yield queryRunner.addColumn("journal_detail", new typeorm_1.TableColumn({
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            }));
            yield queryRunner.addColumn("journal_detail", new typeorm_1.TableColumn({
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("journal_detail", "description");
            yield queryRunner.dropColumn("journal_detail", "created_at");
            yield queryRunner.dropColumn("journal_detail", "updated_at");
        });
    }
}
exports.AddFieldJurnalDetail1745233497543 = AddFieldJurnalDetail1745233497543;
