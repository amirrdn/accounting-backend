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
exports.AddExistingCashBank1745230493137 = void 0;
const typeorm_1 = require("typeorm");
class AddExistingCashBank1745230493137 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("cash_bank_transaction", new typeorm_1.TableColumn({
                name: "isApproved",
                type: "boolean",
                default: false,
            }));
            yield queryRunner.addColumn("cash_bank_transaction", new typeorm_1.TableColumn({
                name: "destinationAccountId",
                type: "int",
                isNullable: true,
            }));
            yield queryRunner.createForeignKey("cash_bank_transaction", new typeorm_1.TableForeignKey({
                columnNames: ["destinationAccountId"],
                referencedTableName: "account",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL"
            }));
            yield queryRunner.addColumn("cash_bank_transaction", new typeorm_1.TableColumn({
                name: "branchId",
                type: "int",
                isNullable: true,
            }));
            yield queryRunner.createForeignKey("cash_bank_transaction", new typeorm_1.TableForeignKey({
                columnNames: ["branchId"],
                referencedTableName: "branch",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL"
            }));
            yield queryRunner.addColumn("cash_bank_transaction", new typeorm_1.TableColumn({
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            }));
            yield queryRunner.addColumn("cash_bank_transaction", new typeorm_1.TableColumn({
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP"
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("cash_bank_transaction", "updated_at");
            yield queryRunner.dropColumn("cash_bank_transaction", "created_at");
            const table = yield queryRunner.getTable("cash_bank_transaction");
            if (!table)
                return;
            const branchFK = table.foreignKeys.find(fk => fk.columnNames.includes("branchId"));
            if (branchFK)
                yield queryRunner.dropForeignKey("cash_bank_transaction", branchFK);
            yield queryRunner.dropColumn("cash_bank_transaction", "branchId");
            const destAccountFK = table.foreignKeys.find(fk => fk.columnNames.includes("destinationAccountId"));
            if (destAccountFK)
                yield queryRunner.dropForeignKey("cash_bank_transaction", destAccountFK);
            yield queryRunner.dropColumn("cash_bank_transaction", "destinationAccountId");
            yield queryRunner.dropColumn("cash_bank_transaction", "isApproved");
        });
    }
}
exports.AddExistingCashBank1745230493137 = AddExistingCashBank1745230493137;
