import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddExistingCashBank1745230493137 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("cash_bank_transaction", new TableColumn({
            name: "isApproved",
            type: "boolean",
            default: false,
          }));

          await queryRunner.addColumn("cash_bank_transaction", new TableColumn({
            name: "destinationAccountId",
            type: "int",
            isNullable: true,
          }));

          await queryRunner.createForeignKey("cash_bank_transaction", new TableForeignKey({
            columnNames: ["destinationAccountId"],
            referencedTableName: "account",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL"
          }));

          await queryRunner.addColumn("cash_bank_transaction", new TableColumn({
            name: "branchId",
            type: "int",
            isNullable: true,
          }));

          await queryRunner.createForeignKey("cash_bank_transaction", new TableForeignKey({
            columnNames: ["branchId"],
            referencedTableName: "branch",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL"
          }));

          await queryRunner.addColumn("cash_bank_transaction", new TableColumn({
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          }));
      
          await queryRunner.addColumn("cash_bank_transaction", new TableColumn({
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("cash_bank_transaction", "updated_at");
        await queryRunner.dropColumn("cash_bank_transaction", "created_at");

        const table = await queryRunner.getTable("cash_bank_transaction");
        if (!table) return;

        const branchFK = table.foreignKeys.find(fk => fk.columnNames.includes("branchId"));
        if (branchFK) await queryRunner.dropForeignKey("cash_bank_transaction", branchFK);
        await queryRunner.dropColumn("cash_bank_transaction", "branchId");

        const destAccountFK = table.foreignKeys.find(fk => fk.columnNames.includes("destinationAccountId"));
        if (destAccountFK) await queryRunner.dropForeignKey("cash_bank_transaction", destAccountFK);
        await queryRunner.dropColumn("cash_bank_transaction", "destinationAccountId");

        await queryRunner.dropColumn("cash_bank_transaction", "isApproved");
    }

}
