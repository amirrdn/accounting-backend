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
exports.JournalDetail = void 0;
const typeorm_1 = require("typeorm");
const JournalEntry_1 = require("./JournalEntry");
const Account_1 = require("./Account");
let JournalDetail = class JournalDetail {
};
exports.JournalDetail = JournalDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JournalDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => JournalEntry_1.JournalEntry, journal => journal.details),
    (0, typeorm_1.JoinColumn)({ name: "journalEntryId" }),
    __metadata("design:type", JournalEntry_1.JournalEntry)
], JournalDetail.prototype, "journal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, { eager: true }),
    __metadata("design:type", Account_1.Account)
], JournalDetail.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], JournalDetail.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], JournalDetail.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JournalDetail.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], JournalDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], JournalDetail.prototype, "updatedAt", void 0);
exports.JournalDetail = JournalDetail = __decorate([
    (0, typeorm_1.Entity)()
], JournalDetail);
