import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePurchaseInvoice1744955269858 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "purchase_invoice",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        default: "'00000000-0000-0000-0000-000000000000'"
                    },
                    {
                        name: "invoice_number",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "invoice_date",
                        type: "date",
                        isNullable: false
                    },
                    {
                        name: "due_date",
                        type: "date",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["UNPAID", "PAID_PARTIAL", "PAID_FULL"],
                        default: "'UNPAID'"
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
                        name: "paid_amount",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "remaining_amount",
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
                        name: "total",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                    },
                    {
                        name: "supplier_id",
                        type: "int",
                    },
                    {
                        name: "purchase_order_id",
                        type: "varchar",
                        length: "36",
                        isNullable: true
                    },
                    {
                        name: "purchase_receipt_id",
                        type: "varchar",
                        length: "36",
                        isNullable: true
                    },
                    {
                        name: "payable_account_id",
                        type: "int",
                    },
                    {
                        name: "branch_id",
                        type: "int",
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
            })
        );

        await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
            columnNames: ["supplier_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "supplier",
            onDelete: "NO ACTION"
        }));

        await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
            columnNames: ["purchase_order_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "purchase_order",
            onDelete: "NO ACTION"
        }));

        await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
            columnNames: ["purchase_receipt_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "purchase_receipt",
            onDelete: "NO ACTION"
        }));

        await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
            columnNames: ["payable_account_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "account",
            onDelete: "NO ACTION"
        }));

        await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
            columnNames: ["branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branch",
            onDelete: "NO ACTION"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("purchase_invoice");
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey("purchase_invoice", foreignKey);
            }
        }
        await queryRunner.dropTable("purchase_invoice");
    }
} 