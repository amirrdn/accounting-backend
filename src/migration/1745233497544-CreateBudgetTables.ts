import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBudgetTables1745233497544 implements MigrationInterface {
    name = 'CreateBudgetTables1745233497544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE budget (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            description TEXT NOT NULL,
            isActive BOOLEAN NOT NULL DEFAULT true,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

        await queryRunner.query(`CREATE TABLE budget_detail (
            id INT AUTO_INCREMENT PRIMARY KEY,
            januaryAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            februaryAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            marchAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            aprilAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            mayAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            juneAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            julyAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            augustAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            septemberAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            octoberAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            novemberAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            decemberAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            totalAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            actualAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            varianceAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            budgetId INT,
            accountId INT,
            FOREIGN KEY (budgetId) REFERENCES budget(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (accountId) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS budget_detail`);
        await queryRunner.query(`DROP TABLE IF EXISTS budget`);
    }
} 