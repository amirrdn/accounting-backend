import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWarehouiseIDPurchaseRequest1745045267879 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`    
            ALTER TABLE purchase_request
            ADD COLUMN warehouse_id INT NULL
          `);
      
          await queryRunner.query(`
            ALTER TABLE purchase_request
            ADD CONSTRAINT FK_warehouse FOREIGN KEY (warehouse_id)
            REFERENCES warehouse(id) ON DELETE SET NULL
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {    
        await queryRunner.query(`
            ALTER TABLE purchase_request
            DROP COLUMN warehouse_id
        `);
    }

}
