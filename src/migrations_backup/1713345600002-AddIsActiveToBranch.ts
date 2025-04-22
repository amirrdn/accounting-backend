import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIsActiveToBranch1713345600002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("branch", new TableColumn({
      name: "isActive",
      type: "boolean",
      default: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("branch", "isActive");
  }
} 