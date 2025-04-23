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
exports.StockOpname = void 0;
const typeorm_1 = require("typeorm");
const StockOpnameItem_1 = require("./StockOpnameItem");
const Warehouse_1 = require("./Warehouse");
let StockOpname = class StockOpname {
};
exports.StockOpname = StockOpname;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockOpname.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], StockOpname.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_id" }),
    __metadata("design:type", Warehouse_1.Warehouse)
], StockOpname.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockOpnameItem_1.StockOpnameItem, item => item.stockOpname, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], StockOpname.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], StockOpname.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], StockOpname.prototype, "updatedAt", void 0);
exports.StockOpname = StockOpname = __decorate([
    (0, typeorm_1.Entity)()
], StockOpname);
