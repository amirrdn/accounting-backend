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
exports.PurchaseReceipt = exports.PurchaseReceiptStatus = void 0;
const typeorm_1 = require("typeorm");
const PurchaseOrder_1 = require("./PurchaseOrder");
const Branch_1 = require("./Branch");
const PurchaseReceiptItem_1 = require("./PurchaseReceiptItem");
var PurchaseReceiptStatus;
(function (PurchaseReceiptStatus) {
    PurchaseReceiptStatus["DRAFT"] = "DRAFT";
    PurchaseReceiptStatus["COMPLETED"] = "COMPLETED";
})(PurchaseReceiptStatus || (exports.PurchaseReceiptStatus = PurchaseReceiptStatus = {}));
let PurchaseReceipt = class PurchaseReceipt {
};
exports.PurchaseReceipt = PurchaseReceipt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PurchaseReceipt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseReceipt.prototype, "receiptNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], PurchaseReceipt.prototype, "receiptDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseOrder_1.PurchaseOrder),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PurchaseOrder_1.PurchaseOrder)
], PurchaseReceipt.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Branch_1.Branch)
], PurchaseReceipt.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseReceiptItem_1.PurchaseReceiptItem, (item) => item.purchaseReceipt, {
        cascade: true
    }),
    __metadata("design:type", Array)
], PurchaseReceipt.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: PurchaseReceiptStatus,
        default: PurchaseReceiptStatus.DRAFT
    }),
    __metadata("design:type", String)
], PurchaseReceipt.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseReceipt.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseReceipt.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PurchaseReceipt.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PurchaseReceipt.prototype, "updatedAt", void 0);
exports.PurchaseReceipt = PurchaseReceipt = __decorate([
    (0, typeorm_1.Entity)()
], PurchaseReceipt);
