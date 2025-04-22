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
exports.CreatePurchaseOrder1744955269860 = void 0;
const typeorm_1 = require("typeorm");
class CreatePurchaseOrder1744955269860 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "purchase_order",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "po_number",
                        type: "varchar"
                    },
                    {
                        name: "order_date",
                        type: "date"
                    },
                    {
                        name: "expected_delivery_date",
                        type: "date"
                    },
                    {
                        name: "supplier_id",
                        type: "uuid"
                    },
                    {
                        name: "branch_id",
                        type: "uuid"
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["DRAFT", "APPROVED", "SENT", "RECEIVED_PARTIAL", "RECEIVED_FULL"],
                        default: "'DRAFT'"
                    },
                    {
                        name: "subtotal",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "tax_amount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "total_amount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "is_ppn",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "is_pph",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "ppn_rate",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "pph_rate",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "notes",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "attachment_url",
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
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }));
            yield queryRunner.createForeignKey("purchase_order", new typeorm_1.TableForeignKey({
                columnNames: ["supplier_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "supplier",
                onDelete: "CASCADE"
            }));
            yield queryRunner.createForeignKey("purchase_order", new typeorm_1.TableForeignKey({
                columnNames: ["branch_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "branch",
                onDelete: "CASCADE"
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("purchase_order");
            if (table) {
                const foreignKeys = table.foreignKeys;
                yield Promise.all(foreignKeys.map(foreignKey => queryRunner.dropForeignKey("purchase_order", foreignKey)));
            }
            yield queryRunner.dropTable("purchase_order");
        });
    }
}
exports.CreatePurchaseOrder1744955269860 = CreatePurchaseOrder1744955269860;
