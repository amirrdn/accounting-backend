import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePurchasePayment1744955269861 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            }),
            true
        );

        await queryRunner.createForeignKey(
            "purchase_payment",
            new TableForeignKey({
                columnNames: ["purchase_invoice_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_invoice",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "purchase_payment",
            new TableForeignKey({
                columnNames: ["payment_account_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "account",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("purchase_payment");
        if (table) {
            const foreignKeys = table.foreignKeys;
            await Promise.all(
                foreignKeys.map((foreignKey) =>
                    queryRunner.dropForeignKey("purchase_payment", foreignKey)
                )
            );
        }
        await queryRunner.dropTable("purchase_payment");
    }
} 