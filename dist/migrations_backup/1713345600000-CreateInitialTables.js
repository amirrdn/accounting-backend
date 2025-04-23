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
exports.CreateInitialTables1713345600000 = void 0;
class CreateInitialTables1713345600000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE TABLE account (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                type ENUM('asset', 'liability', 'equity', 'revenue', 'expense', 'cash', 'bank') NOT NULL,
                parentId INT,
                FOREIGN KEY (parentId) REFERENCES account(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE user (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE customer (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                phone VARCHAR(20),
                email VARCHAR(255)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE supplier (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                phone VARCHAR(20),
                email VARCHAR(255)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE product (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                unit VARCHAR(50) NOT NULL,
                price DECIMAL(15,2) NOT NULL,
                cost DECIMAL(15,2) NOT NULL
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE warehouse (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE product_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId INT NOT NULL,
                warehouseId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (productId) REFERENCES product(id),
                FOREIGN KEY (warehouseId) REFERENCES warehouse(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE sales_invoice (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                customerId INT NOT NULL,
                total DECIMAL(15,2) NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (customerId) REFERENCES customer(id)
            )
        `);
            yield queryRunner.query(`
            CREATE TABLE sales_invoice_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                salesInvoiceId INT NOT NULL,
                productId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                price DECIMAL(15,2) NOT NULL,
                total DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (salesInvoiceId) REFERENCES sales_invoice(id),
                FOREIGN KEY (productId) REFERENCES product(id)
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.CreateInitialTables1713345600000 = CreateInitialTables1713345600000;
