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
exports.StockAdjustment = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const User_1 = require("./User");
let StockAdjustment = class StockAdjustment {
};
exports.StockAdjustment = StockAdjustment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockAdjustment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], StockAdjustment.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "actual_stock" }),
    __metadata("design:type", Number)
], StockAdjustment.prototype, "actualStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "system_stock" }),
    __metadata("design:type", Number)
], StockAdjustment.prototype, "systemStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "difference" }),
    __metadata("design:type", Number)
], StockAdjustment.prototype, "difference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "adjusted_by_id" }),
    __metadata("design:type", User_1.User)
], StockAdjustment.prototype, "adjustedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "adjusted_at" }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "adjustedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "updatedAt", void 0);
exports.StockAdjustment = StockAdjustment = __decorate([
    (0, typeorm_1.Entity)()
], StockAdjustment);
