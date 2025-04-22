import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePurchaseInvoiceItem1744955269859 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            }),
            true
        );

        await queryRunner.createForeignKey(
            "purchase_invoice_item",
            new TableForeignKey({
                columnNames: ["purchaseInvoiceId"],
                referencedColumnNames: ["id"],
                referencedTableName: "purchase_invoice",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "purchase_invoice_item",
            new TableForeignKey({
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "product",
                onDelete: "NO ACTION",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("purchase_invoice_item");
        if (table) {
            const foreignKeys = table.foreignKeys;
            await Promise.all(
                foreignKeys.map((foreignKey) =>
                    queryRunner.dropForeignKey("purchase_invoice_item", foreignKey)
                )
            );
        }
        await queryRunner.dropTable("purchase_invoice_item");
    }
} 