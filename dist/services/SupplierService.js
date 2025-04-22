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
exports.SupplierService = void 0;
const data_source_1 = require("../data-source");
const Supplier_1 = require("../entity/Supplier");
const supplierRepo = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
class SupplierService {
    static getAll() {
        return supplierRepo.find();
    }
    static getById(id) {
        return supplierRepo.findOneBy({ id });
    }
    static create(data) {
        const supplier = supplierRepo.create(data);
        return supplierRepo.save(supplier);
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield supplierRepo.update(id, data);
            return supplierRepo.findOneBy({ id });
        });
    }
    static delete(id) {
        return supplierRepo.delete(id);
    }
}
exports.SupplierService = SupplierService;
