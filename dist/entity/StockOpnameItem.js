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
exports.StockOpnameItem = void 0;
const typeorm_1 = require("typeorm");
const StockOpname_1 = require("./StockOpname");
const Product_1 = require("./Product");
let StockOpnameItem = class StockOpnameItem {
};
exports.StockOpnameItem = StockOpnameItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockOpnameItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => StockOpname_1.StockOpname, (opname) => opname.items),
    (0, typeorm_1.JoinColumn)({ name: "stock_opname_id" }),
    __metadata("design:type", StockOpname_1.StockOpname)
], StockOpnameItem.prototype, "stockOpname", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], StockOpnameItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "actual_qty" }),
    __metadata("design:type", Number)
], StockOpnameItem.prototype, "actualQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "system_qty" }),
    __metadata("design:type", Number)
], StockOpnameItem.prototype, "systemQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "diff_qty" }),
    __metadata("design:type", Number)
], StockOpnameItem.prototype, "diffQty", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], StockOpnameItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], StockOpnameItem.prototype, "updatedAt", void 0);
exports.StockOpnameItem = StockOpnameItem = __decorate([
    (0, typeorm_1.Entity)()
], StockOpnameItem);
