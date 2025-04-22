import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNotesToSalesInvoice1713345600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("sales_invoice", new TableColumn({
      name: "notes",
      type: "text",
      isNullable: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("sales_invoice", "notes");
  }
} 