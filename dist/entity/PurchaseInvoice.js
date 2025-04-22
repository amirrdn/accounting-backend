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
exports.PurchaseInvoice = exports.PurchaseInvoiceStatus = void 0;
const typeorm_1 = require("typeorm");
const Supplier_1 = require("./Supplier");
const PurchaseInvoiceItem_1 = require("./PurchaseInvoiceItem");
const Account_1 = require("./Account");
const Branch_1 = require("./Branch");
const PurchaseOrder_1 = require("./PurchaseOrder");
const PurchaseReceipt_1 = require("./PurchaseReceipt");
const PurchasePayment_1 = require("./PurchasePayment");
var PurchaseInvoiceStatus;
(function (PurchaseInvoiceStatus) {
    PurchaseInvoiceStatus["UNPAID"] = "UNPAID";
    PurchaseInvoiceStatus["PAID_PARTIAL"] = "PAID_PARTIAL";
    PurchaseInvoiceStatus["PAID_FULL"] = "PAID_FULL";
})(PurchaseInvoiceStatus || (exports.PurchaseInvoiceStatus = PurchaseInvoiceStatus = {}));
let PurchaseInvoice = class PurchaseInvoice {
};
exports.PurchaseInvoice = PurchaseInvoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "date", type: "date" }),
    __metadata("design:type", Date)
], PurchaseInvoice.prototype, "invoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], PurchaseInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Supplier_1.Supplier),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Supplier_1.Supplier)
], PurchaseInvoice.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseOrder_1.PurchaseOrder, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PurchaseOrder_1.PurchaseOrder)
], PurchaseInvoice.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseReceipt_1.PurchaseReceipt, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PurchaseReceipt_1.PurchaseReceipt)
], PurchaseInvoice.prototype, "purchaseReceipt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseInvoiceItem_1.PurchaseInvoiceItem, item => item.purchaseInvoice, {
        cascade: true
    }),
    __metadata("design:type", Array)
], PurchaseInvoice.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchasePayment_1.PurchasePayment, (payment) => payment.purchaseInvoice),
    __metadata("design:type", Array)
], PurchaseInvoice.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: PurchaseInvoiceStatus,
        default: PurchaseInvoiceStatus.UNPAID
    }),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "remainingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PurchaseInvoice.prototype, "isPpn", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PurchaseInvoice.prototype, "isPph", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "ppnRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "pphRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseInvoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PurchaseInvoice.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, { eager: true }),
    __metadata("design:type", Account_1.Account)
], PurchaseInvoice.prototype, "payableAccount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch),
    __metadata("design:type", Branch_1.Branch)
], PurchaseInvoice.prototype, "branch", void 0);
exports.PurchaseInvoice = PurchaseInvoice = __decorate([
    (0, typeorm_1.Entity)()
], PurchaseInvoice);
