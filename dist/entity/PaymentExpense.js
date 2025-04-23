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
exports.PaymentExpense = void 0;
const typeorm_1 = require("typeorm");
const Supplier_1 = require("./Supplier");
const PurchaseInvoice_1 = require("./PurchaseInvoice");
const Account_1 = require("./Account");
let PaymentExpense = class PaymentExpense {
};
exports.PaymentExpense = PaymentExpense;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentExpense.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentExpense.prototype, "paymentNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentExpense.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PaymentExpense.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Supplier_1.Supplier),
    __metadata("design:type", Supplier_1.Supplier)
], PaymentExpense.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseInvoice_1.PurchaseInvoice),
    __metadata("design:type", PurchaseInvoice_1.PurchaseInvoice)
], PaymentExpense.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account),
    __metadata("design:type", Account_1.Account)
], PaymentExpense.prototype, "cashAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentExpense.prototype, "note", void 0);
exports.PaymentExpense = PaymentExpense = __decorate([
    (0, typeorm_1.Entity)()
], PaymentExpense);
