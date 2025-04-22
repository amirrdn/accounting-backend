import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePurchaseOrder1744955269860 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            })
        );

        await queryRunner.createForeignKey(
            "purchase_order",
            new TableForeignKey({
                columnNames: ["supplier_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "supplier",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "purchase_order",
            new TableForeignKey({
                columnNames: ["branch_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "branch",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("purchase_order");
        if (table) {
            const foreignKeys = table.foreignKeys;
            await Promise.all(
                foreignKeys.map(foreignKey =>
                    queryRunner.dropForeignKey("purchase_order", foreignKey)
                )
            );
        }
        await queryRunner.dropTable("purchase_order");
    }
} 