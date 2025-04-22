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
exports.CombinedMigration1744955269863 = void 0;
class CombinedMigration1744955269863 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE TABLE branch (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                phone VARCHAR(20) NULL,
                email VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE user (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE account (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                type ENUM('asset', 'liability', 'equity', 'revenue', 'expense', 'cash', 'bank') NOT NULL,
                parentId INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (parentId) REFERENCES account(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE supplier (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                phone VARCHAR(20),
                email VARCHAR(255),
                npwp VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE customer (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                phone VARCHAR(20),
                email VARCHAR(255),
                npwp VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE product (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                sku VARCHAR(255) NULL,
                price DECIMAL(15, 2) DEFAULT 0 NOT NULL,
                cost DECIMAL(15, 2) DEFAULT 0 NOT NULL,
                is_active BOOLEAN DEFAULT TRUE NOT NULL,
                inventory_account_id INT NULL,
                sales_account_id INT NULL,
                purchase_account_id INT NULL,
                minimumStock INT DEFAULT 0 NOT NULL,
                default_supplier_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
            yield queryRunner.query(`
            CREATE TABLE warehouse (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE product_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId INT NOT NULL,
                warehouseId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (productId) REFERENCES product(id),
                FOREIGN KEY (warehouseId) REFERENCES warehouse(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE sales_invoice (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_number VARCHAR(255) NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                customer_id INT NOT NULL,
                receivable_account_id INT NOT NULL,
                total DECIMAL(15, 2) NOT NULL,
                branch_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                notes TEXT NULL
            );
        `);
            yield queryRunner.query(`
            CREATE TABLE sales_invoice_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                salesInvoiceId INT,
                productId INT,
                quantity DECIMAL(15,2) NOT NULL,
                price DECIMAL(15,2) NOT NULL,
                total DECIMAL(15,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (salesInvoiceId) REFERENCES sales_invoice(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES product(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE journal_entry (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                description TEXT,
                reference VARCHAR(50)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE journal_detail (
                id INT AUTO_INCREMENT PRIMARY KEY,
                journalEntryId INT NOT NULL,
                accountId INT NOT NULL,
                debit DECIMAL(15,2) NOT NULL,
                credit DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (journalEntryId) REFERENCES journal_entry(id),
                FOREIGN KEY (accountId) REFERENCES account(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE cash_bank_transaction (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE NOT NULL,
                type VARCHAR(50) NOT NULL,
                accountId INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                description TEXT,
                FOREIGN KEY (accountId) REFERENCES account(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE audit_trail (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                action VARCHAR(50) NOT NULL,
                tableName VARCHAR(50) NOT NULL,
                recordId INT NOT NULL,
                oldValue TEXT,
                newValue TEXT,
                timestamp DATETIME NOT NULL,
                FOREIGN KEY (userId) REFERENCES user(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_order (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poNumber VARCHAR(255) NOT NULL,
                orderDate DATE NOT NULL,
                expectedDeliveryDate DATE NOT NULL,
                supplierId INT,
                branchId INT,
                status ENUM('DRAFT', 'APPROVED', 'SENT', 'RECEIVED_PARTIAL', 'RECEIVED_FULL') NOT NULL DEFAULT 'DRAFT',
                subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
                taxAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
                totalAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
                isPpn BOOLEAN NOT NULL DEFAULT false,
                isPph BOOLEAN NOT NULL DEFAULT false,
                ppnRate DECIMAL(5,2) NOT NULL DEFAULT 0,
                pphRate DECIMAL(5,2) NOT NULL DEFAULT 0,
                notes VARCHAR(255),
                attachmentUrl VARCHAR(255),
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_po_supplier FOREIGN KEY (supplierId) REFERENCES supplier(id) ON DELETE SET NULL,
                CONSTRAINT FK_po_branch FOREIGN KEY (branchId) REFERENCES branch(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_order_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                purchaseOrderId INT NOT NULL,
                productId INT,
                quantity DECIMAL(10,2) NOT NULL,
                unitPrice DECIMAL(15,2) NOT NULL,
                discount DECIMAL(15,2) NOT NULL DEFAULT 0,
                subtotal DECIMAL(15,2) NOT NULL,
                taxAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
                total DECIMAL(15,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_purchase_order_item_order FOREIGN KEY (purchaseOrderId) REFERENCES purchase_order(id) ON DELETE CASCADE,
                CONSTRAINT FK_purchase_order_item_product FOREIGN KEY (productId) REFERENCES product(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_invoice (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                supplierId INT NOT NULL,
                purchaseOrderId INT,
                total DECIMAL(15,2) NOT NULL,
                status VARCHAR(50) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (supplierId) REFERENCES supplier(id),
                FOREIGN KEY (purchaseOrderId) REFERENCES purchase_order(id)
            )
        `);
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
            yield queryRunner.query(`
            CREATE TABLE purchase_invoice_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                purchaseInvoiceId INT,
                productId INT,
                quantity DECIMAL(15,2) NOT NULL,
                price DECIMAL(15,2) NOT NULL,
                total DECIMAL(15,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (purchaseInvoiceId) REFERENCES purchase_invoice(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES product(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_payment (
                id INT AUTO_INCREMENT PRIMARY KEY,
                paymentNumber VARCHAR(255) NOT NULL,
                paymentDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                amount DECIMAL(15,2) NOT NULL,
                purchaseInvoiceId INT,
                paymentAccountId INT,
                notes VARCHAR(255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_payment_invoice FOREIGN KEY (purchaseInvoiceId) REFERENCES purchase_invoice(id) ON DELETE SET NULL,
                CONSTRAINT FK_payment_account FOREIGN KEY (paymentAccountId) REFERENCES account(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_receipt (
                id INT AUTO_INCREMENT PRIMARY KEY,
                receiptNumber VARCHAR(255) NOT NULL,
                receiptDate DATE NOT NULL,
                purchaseOrderId INT,
                branchId INT,
                status VARCHAR(255) NOT NULL DEFAULT 'DRAFT',
                totalAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
                notes VARCHAR(255),
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_receipt_order FOREIGN KEY (purchaseOrderId) REFERENCES purchase_order(id) ON DELETE SET NULL,
                CONSTRAINT FK_receipt_branch FOREIGN KEY (branchId) REFERENCES branch(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE purchase_receipt_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                purchaseReceiptId INT,
                productId INT,
                quantity DECIMAL(10,2) NOT NULL,
                unitPrice DECIMAL(15,2) NOT NULL,
                subtotal DECIMAL(15,2) NOT NULL,
                CONSTRAINT FK_receipt_item_receipt FOREIGN KEY (purchaseReceiptId) REFERENCES purchase_receipt(id) ON DELETE SET NULL,
                CONSTRAINT FK_receipt_item_product FOREIGN KEY (productId) REFERENCES product(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,
                warehouse_id INT,
                quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT UQ_stock_product_warehouse UNIQUE (product_id, warehouse_id),
                CONSTRAINT FK_stock_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
                CONSTRAINT FK_stock_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock_adjustment (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,
                actual_stock INT NOT NULL,
                system_stock INT NOT NULL,
                difference INT NOT NULL,
                reason TEXT,
                adjusted_by_id INT,
                adjusted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_stock_adjustment_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
                CONSTRAINT FK_stock_adjustment_user FOREIGN KEY (adjusted_by_id) REFERENCES user(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock_mutation (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,
                reference VARCHAR(255) NOT NULL,
                type ENUM('IN', 'OUT') NOT NULL,
                quantity INT NOT NULL,
                date TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_stock_mutation_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock_opname (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                warehouse_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_stock_opname_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock_opname_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stock_opname_id INT,
                product_id INT,
                actual_qty INT NOT NULL,
                system_qty INT NOT NULL,
                diff_qty INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_stock_opname_item_stock_opname FOREIGN KEY (stock_opname_id) REFERENCES stock_opname(id) ON DELETE CASCADE,
                CONSTRAINT FK_stock_opname_item_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock_transfer (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transfer_date DATE NOT NULL,
                from_warehouse_id INT NOT NULL,
                to_warehouse_id INT NOT NULL,
                status VARCHAR(255) DEFAULT 'SENT',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_stock_transfer_from_warehouse FOREIGN KEY (from_warehouse_id) REFERENCES warehouse(id) ON DELETE CASCADE,
                CONSTRAINT FK_stock_transfer_to_warehouse FOREIGN KEY (to_warehouse_id) REFERENCES warehouse(id) ON DELETE CASCADE
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE stock_transfer_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transfer_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_stock_transfer_item_transfer FOREIGN KEY (transfer_id) REFERENCES stock_transfer(id) ON DELETE CASCADE,
                CONSTRAINT FK_stock_transfer_item_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
            )
        `);
            yield queryRunner.query(`
            ALTER TABLE product
            ADD CONSTRAINT FK_inventory_account FOREIGN KEY (inventory_account_id) REFERENCES account(id);
        `);
            yield queryRunner.query(`
            ALTER TABLE product
            ADD CONSTRAINT FK_sales_account FOREIGN KEY (sales_account_id) REFERENCES account(id);
        `);
            yield queryRunner.query(`
            ALTER TABLE product
            ADD CONSTRAINT FK_purchase_account FOREIGN KEY (purchase_account_id) REFERENCES account(id);
        `);
            yield queryRunner.query(`
            ALTER TABLE product
            ADD CONSTRAINT FK_default_supplier FOREIGN KEY (default_supplier_id) REFERENCES supplier(id);
        `);
            yield queryRunner.query(`
            ALTER TABLE sales_invoice
            ADD CONSTRAINT FK_sales_invoice_customer FOREIGN KEY (customer_id) REFERENCES customer(id);
        `);
            yield queryRunner.query(`
            ALTER TABLE sales_invoice
            ADD CONSTRAINT FK_sales_invoice_receivable_account FOREIGN KEY (receivable_account_id) REFERENCES account(id);
        `);
            yield queryRunner.query(`
            ALTER TABLE sales_invoice
            ADD CONSTRAINT FK_sales_invoice_branch FOREIGN KEY (branch_id) REFERENCES branch(id);
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_receipt_item`);
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_receipt`);
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_payment`);
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_invoice_item`);
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_invoice`);
            yield queryRunner.query(`ALTER TABLE purchase_request_item DROP FOREIGN KEY FK_purchase_request_item_product`);
            yield queryRunner.query(`ALTER TABLE purchase_request_item DROP FOREIGN KEY FK_purchase_request_item_purchase_request`);
            yield queryRunner.query(`ALTER TABLE purchase_request DROP FOREIGN KEY FK_purchase_request_branch`);
            yield queryRunner.query(`ALTER TABLE purchase_request DROP FOREIGN KEY FK_purchase_request_user`);
            yield queryRunner.query(`DROP TABLE purchase_request_item`);
            yield queryRunner.query(`DROP TABLE purchase_request`);
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_order_item`);
            yield queryRunner.query(`DROP TABLE IF EXISTS purchase_order`);
            yield queryRunner.query(`DROP TABLE IF EXISTS audit_trail`);
            yield queryRunner.query(`DROP TABLE IF EXISTS cash_bank_transaction`);
            yield queryRunner.query(`DROP TABLE IF EXISTS journal_detail`);
            yield queryRunner.query(`DROP TABLE IF EXISTS journal_entry`);
            yield queryRunner.query(`DROP TABLE IF EXISTS sales_invoice_item`);
            yield queryRunner.query(`DROP TABLE IF EXISTS sales_invoice`);
            yield queryRunner.query(`DROP TABLE IF EXISTS product_stock`);
            yield queryRunner.query(`DROP TABLE IF EXISTS warehouse`);
            yield queryRunner.query(`DROP TABLE IF EXISTS product`);
            yield queryRunner.query(`DROP TABLE IF EXISTS supplier`);
            yield queryRunner.query(`DROP TABLE IF EXISTS customer`);
            yield queryRunner.query(`DROP TABLE IF EXISTS user`);
            yield queryRunner.query(`DROP TABLE IF EXISTS account`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock_adjustment`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock_mutation`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock_opname`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock_opname_item`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock_transfer_item`);
            yield queryRunner.query(`DROP TABLE IF EXISTS stock_transfer`);
            yield queryRunner.query(`
            ALTER TABLE branch
            DROP COLUMN is_active,
            DROP COLUMN created_at,
            DROP COLUMN updated_at
        `);
            yield queryRunner.query(`DROP TABLE IF EXISTS branch`);
        });
    }
}
exports.CombinedMigration1744955269863 = CombinedMigration1744955269863;
