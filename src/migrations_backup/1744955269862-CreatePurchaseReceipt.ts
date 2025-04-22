import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePurchaseReceipt1744955269862 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            }),
            true
        );

        await queryRunner.createForeignKey(
            "purchase_receipt",
            new TableForeignKey({
                columnNames: ["purchase_order_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_order",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "purchase_receipt",
            new TableForeignKey({
                columnNames: ["branch_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "branch",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("purchase_receipt");
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey("purchase_receipt", foreignKey);
            }
        }
        await queryRunner.dropTable("purchase_receipt");
    }
} 