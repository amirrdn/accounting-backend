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
exports.CreatePurchaseReceipt1744955269862 = void 0;
const typeorm_1 = require("typeorm");
class CreatePurchaseReceipt1744955269862 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "purchase_receipt",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "receipt_number",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "receipt_date",
                        type: "date",
                        isNullable: false
                    },
                    {
                        name: "purchase_order_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "branch_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["DRAFT", "COMPLETED"],
                        default: "'DRAFT'"
                    },
                    {
                        name: "total_amount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "notes",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }), true);
            yield queryRunner.createForeignKey("purchase_receipt", new typeorm_1.TableForeignKey({
                columnNames: ["purchase_order_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_order",
                onDelete: "CASCADE"
            }));
            yield queryRunner.createForeignKey("purchase_receipt", new typeorm_1.TableForeignKey({
                columnNames: ["branch_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "branch",
                onDelete: "CASCADE"
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("purchase_receipt");
            if (table) {
                const foreignKeys = table.foreignKeys;
                for (const foreignKey of foreignKeys) {
                    yield queryRunner.dropForeignKey("purchase_receipt", foreignKey);
                }
            }
            yield queryRunner.dropTable("purchase_receipt");
        });
    }
}
exports.CreatePurchaseReceipt1744955269862 = CreatePurchaseReceipt1744955269862;
