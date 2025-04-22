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
exports.PurchaseRequest = exports.RejectionReason = exports.PurchaseRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Branch_1 = require("./Branch");
const PurchaseRequestItem_1 = require("./PurchaseRequestItem");
const Warehouse_1 = require("./Warehouse");
var PurchaseRequestStatus;
(function (PurchaseRequestStatus) {
    PurchaseRequestStatus["DRAFT"] = "DRAFT";
    PurchaseRequestStatus["PENDING"] = "PENDING";
    PurchaseRequestStatus["APPROVED"] = "APPROVED";
    PurchaseRequestStatus["REJECTED"] = "REJECTED";
})(PurchaseRequestStatus || (exports.PurchaseRequestStatus = PurchaseRequestStatus = {}));
var RejectionReason;
(function (RejectionReason) {
    RejectionReason["BUDGET_EXCEEDED"] = "BUDGET_EXCEEDED";
    RejectionReason["SUPPLIER_ISSUE"] = "SUPPLIER_ISSUE";
    RejectionReason["STOCK_AVAILABLE"] = "STOCK_AVAILABLE";
    RejectionReason["OTHER"] = "OTHER";
})(RejectionReason || (exports.RejectionReason = RejectionReason = {}));
let PurchaseRequest = class PurchaseRequest {
};
exports.PurchaseRequest = PurchaseRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "requestNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], PurchaseRequest.prototype, "requestDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: "requestedById" }),
    __metadata("design:type", User_1.User)
], PurchaseRequest.prototype, "requestedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Branch_1.Branch)
], PurchaseRequest.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseRequestItem_1.PurchaseRequestItem, item => item.purchaseRequest, {
        cascade: true
    }),
    __metadata("design:type", Array)
], PurchaseRequest.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: PurchaseRequestStatus,
        default: PurchaseRequestStatus.DRAFT
    }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "approvalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], PurchaseRequest.prototype, "approvalDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "budgetCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "stockCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "supplierCheck", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], PurchaseRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", Warehouse_1.Warehouse)
], PurchaseRequest.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "rejectionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], PurchaseRequest.prototype, "rejectionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: RejectionReason,
        nullable: true
    }),
    __metadata("design:type", String)
], PurchaseRequest.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], PurchaseRequest.prototype, "rejectedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PurchaseRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PurchaseRequest.prototype, "updatedAt", void 0);
exports.PurchaseRequest = PurchaseRequest = __decorate([
    (0, typeorm_1.Entity)()
], PurchaseRequest);
