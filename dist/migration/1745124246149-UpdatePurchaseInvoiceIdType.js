"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePurchaseInvoiceIdType1744955269868 = void 0;
class UpdatePurchaseInvoiceIdType1744955269868 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield queryRunner.query(`ALTER TABLE purchase_payment DROP FOREIGN KEY FK_payment_invoice`);
            }
            catch (error) {
            }
            try {
                yield queryRunner.query(`ALTER TABLE purchase_invoice_item DROP FOREIGN KEY purchase_invoice_item_ibfk_1`);
            }
            catch (error) {
            }
            yield queryRunner.query(`ALTER TABLE purchase_invoice MODIFY COLUMN id BIGINT AUTO_INCREMENT`);
            yield queryRunner.query(`
            ALTER TABLE purchase_payment 
            MODIFY COLUMN purchaseInvoiceId BIGINT
        `);
            yield queryRunner.query(`
            ALTER TABLE purchase_invoice_item 
            MODIFY COLUMN purchaseInvoiceId BIGINT
        `);
            yield queryRunner.query(`
            ALTER TABLE purchase_payment 
            ADD CONSTRAINT FK_payment_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
            yield queryRunner.query(`
            ALTER TABLE purchase_invoice_item 
            ADD CONSTRAINT FK_invoice_item_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE purchase_payment DROP FOREIGN KEY FK_payment_invoice`);
            yield queryRunner.query(`ALTER TABLE purchase_invoice_item DROP FOREIGN KEY FK_invoice_item_invoice`);
            yield queryRunner.query(`ALTER TABLE purchase_invoice MODIFY COLUMN id INT AUTO_INCREMENT`);
            yield queryRunner.query(`ALTER TABLE purchase_payment MODIFY COLUMN purchaseInvoiceId INT`);
            yield queryRunner.query(`ALTER TABLE purchase_invoice_item MODIFY COLUMN purchaseInvoiceId INT`);
            yield queryRunner.query(`
            ALTER TABLE purchase_payment 
            ADD CONSTRAINT FK_payment_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
            yield queryRunner.query(`
            ALTER TABLE purchase_invoice_item 
            ADD CONSTRAINT FK_invoice_item_invoice 
            FOREIGN KEY (purchaseInvoiceId) 
            REFERENCES purchase_invoice(id)
        `);
        });
    }
}
exports.UpdatePurchaseInvoiceIdType1744955269868 = UpdatePurchaseInvoiceIdType1744955269868;
