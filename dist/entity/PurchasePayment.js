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
exports.PurchasePayment = void 0;
const typeorm_1 = require("typeorm");
const PurchaseInvoice_1 = require("./PurchaseInvoice");
const Account_1 = require("./Account");
let PurchasePayment = class PurchasePayment {
};
exports.PurchasePayment = PurchasePayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchasePayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePayment.prototype, "paymentNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PurchasePayment.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchasePayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseInvoice_1.PurchaseInvoice, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'purchaseInvoiceId' }),
    __metadata("design:type", PurchaseInvoice_1.PurchaseInvoice)
], PurchasePayment.prototype, "purchaseInvoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PurchasePayment.prototype, "purchaseInvoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'paymentAccountId' }),
    __metadata("design:type", Account_1.Account)
], PurchasePayment.prototype, "paymentAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PurchasePayment.prototype, "paymentAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchasePayment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], PurchasePayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], PurchasePayment.prototype, "updatedAt", void 0);
exports.PurchasePayment = PurchasePayment = __decorate([
    (0, typeorm_1.Entity)()
], PurchasePayment);
