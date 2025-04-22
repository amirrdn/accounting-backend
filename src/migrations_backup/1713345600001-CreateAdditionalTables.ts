import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdditionalTables1713345600001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS branch (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                phone VARCHAR(20),
                email VARCHAR(255)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS budget (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                startDate DATE NOT NULL,
                endDate DATE NOT NULL,
                status VARCHAR(50) NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS budget_detail (
                id INT AUTO_INCREMENT PRIMARY KEY,
                budgetId INT NOT NULL,
                accountId INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (budgetId) REFERENCES budget(id),
                FOREIGN KEY (accountId) REFERENCES account(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS petty_cash (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                accountId INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (accountId) REFERENCES account(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS bill_of_material (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS bill_of_material_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                billOfMaterialId INT NOT NULL,
                productId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (billOfMaterialId) REFERENCES bill_of_material(id),
                FOREIGN KEY (productId) REFERENCES product(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS production_order (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                billOfMaterialId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (billOfMaterialId) REFERENCES bill_of_material(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId INT NOT NULL,
                warehouseId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (productId) REFERENCES product(id),
                FOREIGN KEY (warehouseId) REFERENCES warehouse(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock_opname (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                warehouseId INT NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (warehouseId) REFERENCES warehouse(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock_opname_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stockOpnameId INT NOT NULL,
                productId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (stockOpnameId) REFERENCES stock_opname(id),
                FOREIGN KEY (productId) REFERENCES product(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock_transfer (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                fromWarehouseId INT NOT NULL,
                toWarehouseId INT NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (fromWarehouseId) REFERENCES warehouse(id),
                FOREIGN KEY (toWarehouseId) REFERENCES warehouse(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock_transfer_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stockTransferId INT NOT NULL,
                productId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                FOREIGN KEY (stockTransferId) REFERENCES stock_transfer(id),
                FOREIGN KEY (productId) REFERENCES product(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock_adjustment (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                warehouseId INT NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (warehouseId) REFERENCES warehouse(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS stock_mutation (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE NOT NULL,
                productId INT NOT NULL,
                warehouseId INT NOT NULL,
                quantity DECIMAL(15,2) NOT NULL,
                type VARCHAR(50) NOT NULL,
                reference VARCHAR(50),
                FOREIGN KEY (productId) REFERENCES product(id),
                FOREIGN KEY (warehouseId) REFERENCES warehouse(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS payment_expense (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                accountId INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (accountId) REFERENCES account(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS payment_receipt (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                accountId INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (accountId) REFERENCES account(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS account_setting (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(50) NOT NULL,
                value TEXT NOT NULL,
                description TEXT
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS account_setting`);
        await queryRunner.query(`DROP TABLE IF EXISTS payment_receipt`);
        await queryRunner.query(`DROP TABLE IF EXISTS payment_expense`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock_mutation`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock_adjustment`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock_transfer_item`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock_transfer`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock_opname_item`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock_opname`);
        await queryRunner.query(`DROP TABLE IF EXISTS stock`);
        await queryRunner.query(`DROP TABLE IF EXISTS production_order`);
        await queryRunner.query(`DROP TABLE IF EXISTS bill_of_material_item`);
        await queryRunner.query(`DROP TABLE IF EXISTS bill_of_material`);
        await queryRunner.query(`DROP TABLE IF EXISTS petty_cash`);
        await queryRunner.query(`DROP TABLE IF EXISTS budget_detail`);
        await queryRunner.query(`DROP TABLE IF EXISTS budget`);
        await queryRunner.query(`DROP TABLE IF EXISTS branch`);
    }
} 