import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldJurnalDetail1745233497543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "journal_detail",
            new TableColumn({
              name: "description",
              type: "text",
              isNullable: true,
            })
          );
      
          await queryRunner.addColumn(
            "journal_detail",
            new TableColumn({
              name: "created_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
            })
          );
      
          await queryRunner.addColumn(
            "journal_detail",
            new TableColumn({
              name: "updated_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP",
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("journal_detail", "description");
        await queryRunner.dropColumn("journal_detail", "created_at");
        await queryRunner.dropColumn("journal_detail", "updated_at");
    }

}
