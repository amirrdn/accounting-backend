"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashBankTransaction = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Branch_1 = require("./Branch");
let CashBankTransaction = class CashBankTransaction {
};
exports.CashBankTransaction = CashBankTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CashBankTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CashBankTransaction.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CashBankTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], CashBankTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CashBankTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "accountId" }),
    __metadata("design:type", Account_1.Account)
], CashBankTransaction.prototype, "sourceAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CashBankTransaction.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "destinationAccountId" }),
    __metadata("design:type", Account_1.Account)
], CashBankTransaction.prototype, "destinationAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CashBankTransaction.prototype, "destinationAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CashBankTransaction.prototype, "isApproved", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: "branchId" }),
    __metadata("design:type", Branch_1.Branch)
], CashBankTransaction.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CashBankTransaction.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CashBankTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], CashBankTransaction.prototype, "updatedAt", void 0);
exports.CashBankTransaction = CashBankTransaction = __decorate([
    (0, typeorm_1.Entity)("cash_bank_transaction")
], CashBankTransaction);
