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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Supplier_1 = require("./Supplier");
const StockMutation_1 = require("./StockMutation");
const Stock_1 = require("./Stock");
const BillOfMaterial_1 = require("./BillOfMaterial");
const BillOfMaterialItem_1 = require("./BillOfMaterialItem");
const PurchaseOrderItem_1 = require("./PurchaseOrderItem");
const PurchaseInvoiceItem_1 = require("./PurchaseInvoiceItem");
const SalesInvoiceItem_1 = require("./SalesInvoiceItem");
const StockOpnameItem_1 = require("./StockOpnameItem");
const StockAdjustment_1 = require("./StockAdjustment");
const ProductionOrder_1 = require("./ProductionOrder");
const PurchaseRequestItem_1 = require("./PurchaseRequestItem");
const PurchaseReceiptItem_1 = require("./PurchaseReceiptItem");
const StockTransferItem_1 = require("./StockTransferItem");
const ProductStock_1 = require("./ProductStock");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        precision: 15,
        scale: 2,
        default: 0
    }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        precision: 15,
        scale: 2,
        default: 0
    }),
    __metadata("design:type", Number)
], Product.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        default: true
    }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, {
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)({ name: "inventory_account_id" }),
    __metadata("design:type", Account_1.Account)
], Product.prototype, "inventory_account_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, {
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)({ name: "sales_account_id" }),
    __metadata("design:type", Account_1.Account)
], Product.prototype, "sales_account", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, {
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)({ name: "purchase_account_id" }),
    __metadata("design:type", Account_1.Account)
], Product.prototype, "purchase_account", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        default: 0
    }),
    __metadata("design:type", Number)
], Product.prototype, "minimumStock", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Supplier_1.Supplier, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "default_supplier_id" }),
    __metadata("design:type", Supplier_1.Supplier)
], Product.prototype, "defaultSupplier", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockMutation_1.StockMutation, stockMutation => stockMutation.product),
    __metadata("design:type", Array)
], Product.prototype, "stockMutations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Stock_1.Stock, stock => stock.product),
    __metadata("design:type", Array)
], Product.prototype, "stocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BillOfMaterial_1.BillOfMaterial, bom => bom.product),
    __metadata("design:type", Array)
], Product.prototype, "billOfMaterials", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BillOfMaterialItem_1.BillOfMaterialItem, bomItem => bomItem.material),
    __metadata("design:type", Array)
], Product.prototype, "billOfMaterialItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseOrderItem_1.PurchaseOrderItem, poItem => poItem.product),
    __metadata("design:type", Array)
], Product.prototype, "purchaseOrderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseInvoiceItem_1.PurchaseInvoiceItem, piItem => piItem.product),
    __metadata("design:type", Array)
], Product.prototype, "purchaseInvoiceItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SalesInvoiceItem_1.SalesInvoiceItem, siItem => siItem.product),
    __metadata("design:type", Array)
], Product.prototype, "salesInvoiceItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockOpnameItem_1.StockOpnameItem, soItem => soItem.product),
    __metadata("design:type", Array)
], Product.prototype, "stockOpnameItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockAdjustment_1.StockAdjustment, adjustment => adjustment.product),
    __metadata("design:type", Array)
], Product.prototype, "stockAdjustments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductionOrder_1.ProductionOrder, po => po.product),
    __metadata("design:type", Array)
], Product.prototype, "productionOrders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseRequestItem_1.PurchaseRequestItem, item => item.product),
    __metadata("design:type", Array)
], Product.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseReceiptItem_1.PurchaseReceiptItem, prItem => prItem.product),
    __metadata("design:type", Array)
], Product.prototype, "purchaseReceiptItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockTransferItem_1.StockTransferItem, stItem => stItem.product),
    __metadata("design:type", Array)
], Product.prototype, "stockTransferItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductStock_1.ProductStock, productStock => productStock.product),
    __metadata("design:type", Array)
], Product.prototype, "productStocks", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)()
], Product);
