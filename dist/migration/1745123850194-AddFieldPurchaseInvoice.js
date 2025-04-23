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
exports.AddFieldPurchaseInvoice1745123850194 = void 0;
const typeorm_1 = require("typeorm");
class AddFieldPurchaseInvoice1745123850194 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "dueDate",
                type: "date",
                isNullable: false,
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "purchaseReceiptId",
                type: "int",
                isNullable: true,
            }));
            yield queryRunner.createForeignKey("purchase_invoice", new typeorm_1.TableForeignKey({
                columnNames: ["purchaseReceiptId"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_receipt",
                onDelete: "SET NULL"
            }));
            const financialColumns = [
                { name: "subtotal", precision: 15, scale: 2, default: 0 },
                { name: "taxAmount", precision: 15, scale: 2, default: 0 },
                { name: "totalAmount", precision: 15, scale: 2, default: 0 },
                { name: "paidAmount", precision: 15, scale: 2, default: 0 },
                { name: "remainingAmount", precision: 15, scale: 2, default: 0 },
            ];
            for (const col of financialColumns) {
                yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                    name: col.name,
                    type: "decimal",
                    precision: col.precision,
                    scale: col.scale,
                    default: col.default.toString(),
                }));
            }
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "isPpn",
                type: "boolean",
                default: false,
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "isPph",
                type: "boolean",
                default: false,
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "ppnRate",
                type: "decimal",
                precision: 5,
                scale: 2,
                default: 0,
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "pphRate",
                type: "decimal",
                precision: 5,
                scale: 2,
                default: 0,
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "attachmentUrl",
                type: "varchar",
                isNullable: true,
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "payableAccountId",
                type: "int",
                isNullable: false,
            }));
            yield queryRunner.createForeignKey("purchase_invoice", new typeorm_1.TableForeignKey({
                columnNames: ["payableAccountId"],
                referencedColumnNames: ["id"],
                referencedTableName: "account",
                onDelete: "RESTRICT",
            }));
            yield queryRunner.addColumn("purchase_invoice", new typeorm_1.TableColumn({
                name: "branchId",
                type: "int",
                isNullable: false,
            }));
            yield queryRunner.createForeignKey("purchase_invoice", new typeorm_1.TableForeignKey({
                columnNames: ["branchId"],
                referencedColumnNames: ["id"],
                referencedTableName: "branch",
                onDelete: "RESTRICT",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("purchase_invoice", "dueDate");
            yield queryRunner.dropColumn("purchase_invoice", "purchaseReceiptId");
            yield queryRunner.dropColumn("purchase_invoice", "subtotal");
            yield queryRunner.dropColumn("purchase_invoice", "taxAmount");
            yield queryRunner.dropColumn("purchase_invoice", "totalAmount");
            yield queryRunner.dropColumn("purchase_invoice", "paidAmount");
            yield queryRunner.dropForeignKey("purchase_invoice", "FK_purchase_invoice_branch");
            yield queryRunner.dropColumn("purchase_invoice", "branchId");
        });
    }
}
exports.AddFieldPurchaseInvoice1745123850194 = AddFieldPurchaseInvoice1745123850194;
