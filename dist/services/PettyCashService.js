"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PettyCashService = void 0;
const data_source_1 = require("../data-source");
const PettyCash_1 = require("../entity/PettyCash");
class PettyCashService {
    constructor() {
        this.pettyCashRepository = data_source_1.AppDataSource.getRepository(PettyCash_1.PettyCash);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const pettyCash = this.pettyCashRepository.create(data);
            return yield this.pettyCashRepository.save(pettyCash);
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.pettyCashRepository.createQueryBuilder("pettyCash")
                .leftJoinAndSelect("pettyCash.requestedBy", "requestedBy")
                .leftJoinAndSelect("pettyCash.approvedBy", "approvedBy");
            if (options === null || options === void 0 ? void 0 : options.status) {
                query.andWhere("pettyCash.status = :status", { status: options.status });
            }
            if (options === null || options === void 0 ? void 0 : options.type) {
                query.andWhere("pettyCash.type = :type", { type: options.type });
            }
            if (options === null || options === void 0 ? void 0 : options.startDate) {
                query.andWhere("pettyCash.transactionDate >= :startDate", { startDate: options.startDate });
            }
            if (options === null || options === void 0 ? void 0 : options.endDate) {
                query.andWhere("pettyCash.transactionDate <= :endDate", { endDate: options.endDate });
            }
            return yield query.getMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pettyCashRepository.findOne({
                where: { id },
                relations: ["requestedBy", "approvedBy"]
            });
        });
    }
    approve(id, approver) {
        return __awaiter(this, void 0, void 0, function* () {
            const pettyCash = yield this.findById(id);
            if (!pettyCash)
                throw new Error("Petty cash not found");
            pettyCash.status = "APPROVED";
            pettyCash.approvedBy = approver;
            return yield this.pettyCashRepository.save(pettyCash);
        });
    }
    reject(id, approver) {
        return __awaiter(this, void 0, void 0, function* () {
            const pettyCash = yield this.findById(id);
            if (!pettyCash)
                throw new Error("Petty cash not found");
            pettyCash.status = "REJECTED";
            pettyCash.approvedBy = approver;
            return yield this.pettyCashRepository.save(pettyCash);
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pettyCashRepository
                .createQueryBuilder("pettyCash")
                .where("pettyCash.status = :status", { status: "APPROVED" })
                .select("SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END)", "balance")
                .getRawOne();
            return (result === null || result === void 0 ? void 0 : result.balance) || 0;
        });
    }
}
exports.PettyCashService = PettyCashService;
