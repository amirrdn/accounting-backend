import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPurchasePaymentForeignKey1744955269867 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`ALTER TABLE purchase_payment DROP FOREIGN KEY FK_payment_invoice`);
        } catch (error) {
        }

        await queryRunner.query(`
            ALTER TABLE purchase_payment 
            MODIFY COLUMN purchaseInvoiceId INT NOT NULL,
            ADD CONSTRAINT FK_payment_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE purchase_payment DROP FOREIGN KEY FK_payment_invoice`);
    }
} 