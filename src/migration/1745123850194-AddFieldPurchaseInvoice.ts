import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddFieldPurchaseInvoice1745123850194 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "dueDate",
        type: "date",
        isNullable: false,
      }));
  
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "purchaseReceiptId",
        type: "int",
        isNullable: true,
      }));
      await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
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
        await queryRunner.addColumn("purchase_invoice", new TableColumn({
          name: col.name,
          type: "decimal",
          precision: col.precision,
          scale: col.scale,
          default: col.default.toString(),
        }));
      }
  
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "isPpn",
        type: "boolean",
        default: false,
      }));
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "isPph",
        type: "boolean",
        default: false,
      }));
  
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "ppnRate",
        type: "decimal",
        precision: 5,
        scale: 2,
        default: 0,
      }));
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "pphRate",
        type: "decimal",
        precision: 5,
        scale: 2,
        default: 0,
      }));
  
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "attachmentUrl",
        type: "varchar",
        isNullable: true,
      }));
  
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "payableAccountId",
        type: "int",
        isNullable: false,
      }));
      await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
        columnNames: ["payableAccountId"],
        referencedColumnNames: ["id"],
        referencedTableName: "account",
        onDelete: "RESTRICT",
      }));
    
      await queryRunner.addColumn("purchase_invoice", new TableColumn({
        name: "branchId",
        type: "int",
        isNullable: false,
      }));
      await queryRunner.createForeignKey("purchase_invoice", new TableForeignKey({
        columnNames: ["branchId"],
        referencedColumnNames: ["id"],
        referencedTableName: "branch",
        onDelete: "RESTRICT",
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("purchase_invoice", "dueDate");
        await queryRunner.dropColumn("purchase_invoice", "purchaseReceiptId");
        await queryRunner.dropColumn("purchase_invoice", "subtotal");
        await queryRunner.dropColumn("purchase_invoice", "taxAmount");
        await queryRunner.dropColumn("purchase_invoice", "totalAmount");
        await queryRunner.dropColumn("purchase_invoice", "paidAmount");

        await queryRunner.dropForeignKey("purchase_invoice", "FK_purchase_invoice_branch");
        await queryRunner.dropColumn("purchase_invoice", "branchId");
    }

}
