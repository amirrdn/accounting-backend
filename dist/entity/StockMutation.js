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
exports.StockMutation = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
/**
 * Entity StockMutation digunakan untuk mencatat pergerakan stok produk
 * baik itu penambahan (IN) maupun pengurangan (OUT)
 */
let StockMutation = class StockMutation {
};
exports.StockMutation = StockMutation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockMutation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], StockMutation.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockMutation.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["IN", "OUT"] }),
    __metadata("design:type", String)
], StockMutation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], StockMutation.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp"),
    __metadata("design:type", Date)
], StockMutation.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], StockMutation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], StockMutation.prototype, "updatedAt", void 0);
exports.StockMutation = StockMutation = __decorate([
    (0, typeorm_1.Entity)()
], StockMutation);
function joinColumn(arg0) {
    throw new Error("Function not implemented.");
}
