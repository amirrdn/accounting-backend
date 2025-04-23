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
exports.CreatePurchasePayment1744955269861 = void 0;
const typeorm_1 = require("typeorm");
class CreatePurchasePayment1744955269861 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "purchase_payment",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "payment_number",
                        type: "varchar",
                    },
                    {
                        name: "payment_date",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                    },
                    {
                        name: "notes",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "purchase_invoice_id",
                        type: "uuid",
                    },
                    {
                        name: "payment_account_id",
                        type: "uuid",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }), true);
            yield queryRunner.createForeignKey("purchase_payment", new typeorm_1.TableForeignKey({
                columnNames: ["purchase_invoice_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_invoice",
                onDelete: "CASCADE",
            }));
            yield queryRunner.createForeignKey("purchase_payment", new typeorm_1.TableForeignKey({
                columnNames: ["payment_account_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "account",
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("purchase_payment");
            if (table) {
                const foreignKeys = table.foreignKeys;
                yield Promise.all(foreignKeys.map((foreignKey) => queryRunner.dropForeignKey("purchase_payment", foreignKey)));
            }
            yield queryRunner.dropTable("purchase_payment");
        });
    }
}
exports.CreatePurchasePayment1744955269861 = CreatePurchasePayment1744955269861;
