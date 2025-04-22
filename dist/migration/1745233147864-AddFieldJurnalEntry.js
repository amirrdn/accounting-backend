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
exports.AddFieldJurnalEntry1745233147864 = void 0;
const typeorm_1 = require("typeorm");
class AddFieldJurnalEntry1745233147864 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("journal_entry", new typeorm_1.TableColumn({
                name: "branchId",
                type: "int",
                isNullable: true,
            }));
            yield queryRunner.createForeignKey("journal_entry", new typeorm_1.TableForeignKey({
                columnNames: ["branchId"],
                referencedColumnNames: ["id"],
                referencedTableName: "branch",
                onDelete: "SET NULL",
            }));
            yield queryRunner.addColumn("journal_entry", new typeorm_1.TableColumn({
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            }));
            yield queryRunner.addColumn("journal_entry", new typeorm_1.TableColumn({
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("journal_entry");
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("branchId") !== -1);
            if (foreignKey) {
                yield queryRunner.dropForeignKey("journal_entry", foreignKey);
            }
            yield queryRunner.dropColumn("journal_entry", "branchId");
            yield queryRunner.dropColumn("journal_entry", "created_at");
            yield queryRunner.dropColumn("journal_entry", "updated_at");
        });
    }
}
exports.AddFieldJurnalEntry1745233147864 = AddFieldJurnalEntry1745233147864;
