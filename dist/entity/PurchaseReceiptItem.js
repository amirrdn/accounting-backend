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
exports.PurchaseReceiptItem = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const PurchaseReceipt_1 = require("./PurchaseReceipt");
let PurchaseReceiptItem = class PurchaseReceiptItem {
};
exports.PurchaseReceiptItem = PurchaseReceiptItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PurchaseReceiptItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseReceipt_1.PurchaseReceipt, receipt => receipt.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'purchaseReceiptId' }),
    __metadata("design:type", PurchaseReceipt_1.PurchaseReceipt)
], PurchaseReceiptItem.prototype, "purchaseReceipt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Product_1.Product)
], PurchaseReceiptItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseReceiptItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseReceiptItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseReceiptItem.prototype, "subtotal", void 0);
exports.PurchaseReceiptItem = PurchaseReceiptItem = __decorate([
    (0, typeorm_1.Entity)()
], PurchaseReceiptItem);
