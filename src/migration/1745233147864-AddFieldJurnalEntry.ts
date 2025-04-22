import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddFieldJurnalEntry1745233147864 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "journal_entry",
            new TableColumn({
              name: "branchId",
              type: "int",
              isNullable: true,
            })
          );
      
          await queryRunner.createForeignKey(
            "journal_entry",
            new TableForeignKey({
              columnNames: ["branchId"],
              referencedColumnNames: ["id"],
              referencedTableName: "branch",
              onDelete: "SET NULL",
            })
          );
      
          await queryRunner.addColumn(
            "journal_entry",
            new TableColumn({
              name: "created_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
            })
          );
      
          await queryRunner.addColumn(
            "journal_entry",
            new TableColumn({
              name: "updated_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP",
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("journal_entry");
        const foreignKey = table?.foreignKeys.find(
        fk => fk.columnNames.indexOf("branchId") !== -1
        );
        if (foreignKey) {
        await queryRunner.dropForeignKey("journal_entry", foreignKey);
        }

        await queryRunner.dropColumn("journal_entry", "branchId");
        await queryRunner.dropColumn("journal_entry", "created_at");
        await queryRunner.dropColumn("journal_entry", "updated_at");
    }

}
