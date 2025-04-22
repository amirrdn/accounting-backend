import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToStockAdjustment1713772800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE stock_adjustment 
            ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE stock_adjustment 
            DROP COLUMN status
        `);
    }
} 