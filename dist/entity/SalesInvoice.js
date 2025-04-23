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
exports.SalesInvoice = void 0;
const typeorm_1 = require("typeorm");
const Customer_1 = require("./Customer");
const SalesInvoiceItem_1 = require("./SalesInvoiceItem");
const Account_1 = require("./Account");
const Branch_1 = require("./Branch");
let SalesInvoice = class SalesInvoice {
};
exports.SalesInvoice = SalesInvoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesInvoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SalesInvoice.prototype, "invoice_number", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SalesInvoice.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", Customer_1.Customer)
], SalesInvoice.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "receivable_account_id" }),
    __metadata("design:type", Account_1.Account)
], SalesInvoice.prototype, "receivableAccount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], SalesInvoice.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SalesInvoiceItem_1.SalesInvoiceItem, item => item.invoice, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], SalesInvoice.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: "branch_id" }),
    __metadata("design:type", Branch_1.Branch)
], SalesInvoice.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], SalesInvoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], SalesInvoice.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SalesInvoice.prototype, "notes", void 0);
exports.SalesInvoice = SalesInvoice = __decorate([
    (0, typeorm_1.Entity)()
], SalesInvoice);
