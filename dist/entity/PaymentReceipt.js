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
exports.PaymentReceipt = void 0;
const typeorm_1 = require("typeorm");
const Customer_1 = require("./Customer");
const SalesInvoice_1 = require("./SalesInvoice");
const Account_1 = require("./Account");
let PaymentReceipt = class PaymentReceipt {
};
exports.PaymentReceipt = PaymentReceipt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentReceipt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentReceipt.prototype, "paymentNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentReceipt.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PaymentReceipt.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer),
    __metadata("design:type", Customer_1.Customer)
], PaymentReceipt.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SalesInvoice_1.SalesInvoice),
    __metadata("design:type", SalesInvoice_1.SalesInvoice)
], PaymentReceipt.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account),
    __metadata("design:type", Account_1.Account)
], PaymentReceipt.prototype, "cashAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentReceipt.prototype, "note", void 0);
exports.PaymentReceipt = PaymentReceipt = __decorate([
    (0, typeorm_1.Entity)()
], PaymentReceipt);
