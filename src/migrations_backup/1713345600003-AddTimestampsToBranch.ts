import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimestampsToBranch1713345600003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("branch", [
      new TableColumn({
        name: "createdAt",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP"
      }),
      new TableColumn({
        name: "updatedAt",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
      })
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("branch", "updatedAt");
    await queryRunner.dropColumn("branch", "createdAt");
  }
} 