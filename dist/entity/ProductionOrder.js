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
exports.ProductionOrder = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const Warehouse_1 = require("./Warehouse");
let ProductionOrder = class ProductionOrder {
};
exports.ProductionOrder = ProductionOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductionOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product),
    __metadata("design:type", Product_1.Product)
], ProductionOrder.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], ProductionOrder.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse),
    __metadata("design:type", Warehouse_1.Warehouse)
], ProductionOrder.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductionOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "DRAFT" }),
    __metadata("design:type", String)
], ProductionOrder.prototype, "status", void 0);
exports.ProductionOrder = ProductionOrder = __decorate([
    (0, typeorm_1.Entity)()
], ProductionOrder);
