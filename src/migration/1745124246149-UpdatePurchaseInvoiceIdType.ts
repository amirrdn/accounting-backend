import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePurchaseInvoiceIdType1744955269868 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`ALTER TABLE purchase_payment DROP FOREIGN KEY FK_payment_invoice`);
        } catch (error) {
        }

        try {
            await queryRunner.query(`ALTER TABLE purchase_invoice_item DROP FOREIGN KEY purchase_invoice_item_ibfk_1`);
        } catch (error) {
        }

        await queryRunner.query(`ALTER TABLE purchase_invoice MODIFY COLUMN id BIGINT AUTO_INCREMENT`);

        await queryRunner.query(`
            ALTER TABLE purchase_payment 
            MODIFY COLUMN purchaseInvoiceId BIGINT
        `);

        await queryRunner.query(`
            ALTER TABLE purchase_invoice_item 
            MODIFY COLUMN purchaseInvoiceId BIGINT
        `);

        await queryRunner.query(`
            ALTER TABLE purchase_payment 
            ADD CONSTRAINT FK_payment_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);

        await queryRunner.query(`
            ALTER TABLE purchase_invoice_item 
            ADD CONSTRAINT FK_invoice_item_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE purchase_payment DROP FOREIGN KEY FK_payment_invoice`);
        await queryRunner.query(`ALTER TABLE purchase_invoice_item DROP FOREIGN KEY FK_invoice_item_invoice`);

        await queryRunner.query(`ALTER TABLE purchase_invoice MODIFY COLUMN id INT AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE purchase_payment MODIFY COLUMN purchaseInvoiceId INT`);
        await queryRunner.query(`ALTER TABLE purchase_invoice_item MODIFY COLUMN purchaseInvoiceId INT`);

        await queryRunner.query(`
            ALTER TABLE purchase_payment 
            ADD CONSTRAINT FK_payment_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);

        await queryRunner.query(`
            ALTER TABLE purchase_invoice_item 
            ADD CONSTRAINT FK_invoice_item_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
    }
}