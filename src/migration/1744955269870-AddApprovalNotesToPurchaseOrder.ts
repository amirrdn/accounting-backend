import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApprovalNotesToPurchaseOrder1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD COLUMN \`approval_notes\` TEXT NULL;
        `);

        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD COLUMN \`approval_date\` DATE;
        `);

        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD COLUMN \`approved_by\` INT NULL;
        `);

        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD CONSTRAINT \`FK_approved_by\` FOREIGN KEY (\`approved_by\`) REFERENCES \`user\` (\`id\`) ON DELETE SET NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`purchase_order\` DROP FOREIGN KEY \`FK_approved_by\`;
        `);

        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            DROP COLUMN \`approved_by\`;
        `);

        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            DROP COLUMN \`approval_date\`;
        `);

        await queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            DROP COLUMN \`approval_notes\`;
        `);
    }
}
