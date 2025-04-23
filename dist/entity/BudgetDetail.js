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
exports.BudgetDetail = void 0;
const typeorm_1 = require("typeorm");
const Budget_1 = require("./Budget");
const Account_1 = require("./Account");
let BudgetDetail = class BudgetDetail {
};
exports.BudgetDetail = BudgetDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Budget_1.Budget, budget => budget.details),
    __metadata("design:type", Budget_1.Budget)
], BudgetDetail.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account),
    __metadata("design:type", Account_1.Account)
], BudgetDetail.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "januaryAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "februaryAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "marchAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "aprilAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "mayAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "juneAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "julyAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "augustAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "septemberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "octoberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "novemberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "decemberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "actualAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetDetail.prototype, "varianceAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BudgetDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BudgetDetail.prototype, "updatedAt", void 0);
exports.BudgetDetail = BudgetDetail = __decorate([
    (0, typeorm_1.Entity)()
], BudgetDetail);
