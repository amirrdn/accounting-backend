import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldPurchaseInvoiceItem1745124246147 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("purchase_invoice_item", new TableColumn({
            name: "discount",
            type: "decimal",
            precision: 15,
            scale: 2,
            default: "0",
          }));
      
          await queryRunner.addColumn("purchase_invoice_item", new TableColumn({
            name: "subtotal",
            type: "decimal",
            precision: 15,
            scale: 2,
          }));
      
          await queryRunner.addColumn("purchase_invoice_item", new TableColumn({
            name: "taxAmount",
            type: "decimal",
            precision: 15,
            scale: 2,
            default: "0",
          }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("purchase_invoice_item", "taxAmount");
        await queryRunner.dropColumn("purchase_invoice_item", "subtotal");
        await queryRunner.dropColumn("purchase_invoice_item", "discount");
    }

}
