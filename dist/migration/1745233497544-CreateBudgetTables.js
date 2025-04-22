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
exports.CreateBudgetTables1745233497544 = void 0;
class CreateBudgetTables1745233497544 {
    constructor() {
        this.name = 'CreateBudgetTables1745233497544';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE budget (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            description TEXT NOT NULL,
            isActive BOOLEAN NOT NULL DEFAULT true,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
            yield queryRunner.query(`CREATE TABLE budget_detail (
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE IF EXISTS budget_detail`);
            yield queryRunner.query(`DROP TABLE IF EXISTS budget`);
        });
    }
}
exports.CreateBudgetTables1745233497544 = CreateBudgetTables1745233497544;
