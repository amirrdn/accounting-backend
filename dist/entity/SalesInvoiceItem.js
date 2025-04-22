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
exports.SalesInvoiceItem = void 0;
const typeorm_1 = require("typeorm");
const SalesInvoice_1 = require("./SalesInvoice");
const Product_1 = require("./Product");
let SalesInvoiceItem = class SalesInvoiceItem {
};
exports.SalesInvoiceItem = SalesInvoiceItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesInvoiceItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SalesInvoice_1.SalesInvoice, (invoice) => invoice.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'salesInvoiceId' }),
    __metadata("design:type", SalesInvoice_1.SalesInvoice)
], SalesInvoiceItem.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SalesInvoiceItem.prototype, "salesInvoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, { eager: true }),
    __metadata("design:type", Product_1.Product)
], SalesInvoiceItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SalesInvoiceItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], SalesInvoiceItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], SalesInvoiceItem.prototype, "total", void 0);
exports.SalesInvoiceItem = SalesInvoiceItem = __decorate([
    (0, typeorm_1.Entity)()
], SalesInvoiceItem);
