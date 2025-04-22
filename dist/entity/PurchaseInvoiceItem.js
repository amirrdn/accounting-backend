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
exports.PurchaseInvoiceItem = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const PurchaseInvoice_1 = require("./PurchaseInvoice");
let PurchaseInvoiceItem = class PurchaseInvoiceItem {
};
exports.PurchaseInvoiceItem = PurchaseInvoiceItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PurchaseInvoiceItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseInvoice_1.PurchaseInvoice),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PurchaseInvoice_1.PurchaseInvoice)
], PurchaseInvoiceItem.prototype, "purchaseInvoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Product_1.Product)
], PurchaseInvoiceItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "price", type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "total", void 0);
exports.PurchaseInvoiceItem = PurchaseInvoiceItem = __decorate([
    (0, typeorm_1.Entity)()
], PurchaseInvoiceItem);
