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
exports.CreatePurchaseRequest1710000000000 = void 0;
class CreatePurchaseRequest1710000000000 {
    constructor() {
        this.name = 'CreatePurchaseRequest1710000000000';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE TABLE purchase_request (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                requestNumber VARCHAR(255) NOT NULL,
                requestDate DATE NOT NULL,
                department VARCHAR(255) NOT NULL,
                status ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
                notes VARCHAR(255),
                approvalNotes VARCHAR(255),
                approvalDate DATE,
                budgetCheck VARCHAR(255),
                stockCheck VARCHAR(255),
                supplierCheck VARCHAR(255),
                approvedById INT,
                rejectionNotes VARCHAR(255),
                rejectionDate DATE,
                rejectionReason ENUM('BUDGET_EXCEEDED', 'SUPPLIER_ISSUE', 'STOCK_AVAILABLE', 'OTHER'),
                rejectedById INT,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                requestedById INT,
                branchId INT,
                PRIMARY KEY (id),
                CONSTRAINT FK_purchase_request_user FOREIGN KEY (requestedById) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT FK_purchase_request_branch FOREIGN KEY (branchId) REFERENCES branch(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT FK_purchase_request_approved_by FOREIGN KEY (approvedById) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT FK_purchase_request_rejected_by FOREIGN KEY (rejectedById) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_request_item (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                quantity DECIMAL(10,2) NOT NULL,
                unit VARCHAR(255) NOT NULL,
                notes VARCHAR(255),
                purchaseRequestId CHAR(36),
                productId INT,
                PRIMARY KEY (id),
                CONSTRAINT FK_purchase_request_item_purchase_request FOREIGN KEY (purchaseRequestId) REFERENCES purchase_request(id) ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT FK_purchase_request_item_product FOREIGN KEY (productId) REFERENCES product(id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE purchase_request_item DROP FOREIGN KEY FK_purchase_request_item_product`);
            yield queryRunner.query(`ALTER TABLE purchase_request_item DROP FOREIGN KEY FK_purchase_request_item_purchase_request`);
            yield queryRunner.query(`ALTER TABLE purchase_request DROP FOREIGN KEY FK_purchase_request_branch`);
            yield queryRunner.query(`ALTER TABLE purchase_request DROP FOREIGN KEY FK_purchase_request_user`);
            yield queryRunner.query(`DROP TABLE purchase_request_item`);
            yield queryRunner.query(`DROP TABLE purchase_request`);
        });
    }
}
exports.CreatePurchaseRequest1710000000000 = CreatePurchaseRequest1710000000000;
