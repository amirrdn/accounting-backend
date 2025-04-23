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
exports.CreatePurchaseInvoiceItem1744955269859 = void 0;
const typeorm_1 = require("typeorm");
class CreatePurchaseInvoiceItem1744955269859 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "purchase_invoice_item",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "purchaseInvoiceId",
                        type: "uuid",
                    },
                    {
                        name: "productId",
                        type: "uuid",
                    },
                    {
                        name: "quantity",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: "unitPrice",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                    },
                    {
                        name: "discount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: "subtotal",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                    },
                    {
                        name: "taxAmount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: "total",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                    },
                ],
            }), true);
            yield queryRunner.createForeignKey("purchase_invoice_item", new typeorm_1.TableForeignKey({
                columnNames: ["purchaseInvoiceId"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_invoice",
                onDelete: "CASCADE",
            }));
            yield queryRunner.createForeignKey("purchase_invoice_item", new typeorm_1.TableForeignKey({
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "product",
                onDelete: "NO ACTION",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("purchase_invoice_item");
            if (table) {
                const foreignKeys = table.foreignKeys;
                yield Promise.all(foreignKeys.map((foreignKey) => queryRunner.dropForeignKey("purchase_invoice_item", foreignKey)));
            }
            yield queryRunner.dropTable("purchase_invoice_item");
        });
    }
}
exports.CreatePurchaseInvoiceItem1744955269859 = CreatePurchaseInvoiceItem1744955269859;
