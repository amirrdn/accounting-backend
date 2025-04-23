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
exports.AddApprovalNotesToPurchaseOrder1710000000000 = void 0;
class AddApprovalNotesToPurchaseOrder1710000000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD COLUMN \`approval_notes\` TEXT NULL;
        `);
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD COLUMN \`approval_date\` DATE;
        `);
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD COLUMN \`approved_by\` INT NULL;
        `);
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            ADD CONSTRAINT \`FK_approved_by\` FOREIGN KEY (\`approved_by\`) REFERENCES \`user\` (\`id\`) ON DELETE SET NULL;
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\` DROP FOREIGN KEY \`FK_approved_by\`;
        `);
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            DROP COLUMN \`approved_by\`;
        `);
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            DROP COLUMN \`approval_date\`;
        `);
            yield queryRunner.query(`
            ALTER TABLE \`purchase_order\`
            DROP COLUMN \`approval_notes\`;
        `);
        });
    }
}
exports.AddApprovalNotesToPurchaseOrder1710000000000 = AddApprovalNotesToPurchaseOrder1710000000000;
