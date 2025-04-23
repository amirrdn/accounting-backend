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
exports.ProductStock = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const Warehouse_1 = require("./Warehouse");
let ProductStock = class ProductStock {
};
exports.ProductStock = ProductStock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductStock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product),
    (0, typeorm_1.JoinColumn)({ name: "productId" }),
    __metadata("design:type", Product_1.Product)
], ProductStock.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: "warehouseId" }),
    __metadata("design:type", Warehouse_1.Warehouse)
], ProductStock.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductStock.prototype, "quantity", void 0);
exports.ProductStock = ProductStock = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["product", "warehouse"])
], ProductStock);
