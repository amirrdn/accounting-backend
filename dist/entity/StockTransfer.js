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
exports.StockTransfer = exports.StockTransferStatus = void 0;
const typeorm_1 = require("typeorm");
const Warehouse_1 = require("./Warehouse");
const StockTransferItem_1 = require("./StockTransferItem");
var StockTransferStatus;
(function (StockTransferStatus) {
    StockTransferStatus["DRAFT"] = "DRAFT";
    StockTransferStatus["SENT"] = "SENT";
    StockTransferStatus["RECEIVED"] = "RECEIVED";
})(StockTransferStatus || (exports.StockTransferStatus = StockTransferStatus = {}));
let StockTransfer = class StockTransfer {
};
exports.StockTransfer = StockTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "transfer_date" }),
    __metadata("design:type", Date)
], StockTransfer.prototype, "transferDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: "from_warehouse_id" }),
    __metadata("design:type", Warehouse_1.Warehouse)
], StockTransfer.prototype, "fromWarehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: "to_warehouse_id" }),
    __metadata("design:type", Warehouse_1.Warehouse)
], StockTransfer.prototype, "toWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "SENT" }),
    __metadata("design:type", String)
], StockTransfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockTransferItem_1.StockTransferItem, item => item.transfer, { cascade: true }),
    __metadata("design:type", Array)
], StockTransfer.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], StockTransfer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], StockTransfer.prototype, "updatedAt", void 0);
exports.StockTransfer = StockTransfer = __decorate([
    (0, typeorm_1.Entity)()
], StockTransfer);
