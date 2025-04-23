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
exports.CustomerService = void 0;
const data_source_1 = require("../data-source");
const Customer_1 = require("../entity/Customer");
const customerRepo = data_source_1.AppDataSource.getRepository(Customer_1.Customer);
class CustomerService {
    static getAll() {
        return customerRepo.find();
    }
    static getById(id) {
        return customerRepo.findOneBy({ id });
    }
    static create(data) {
        const customer = customerRepo.create(data);
        return customerRepo.save(customer);
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield customerRepo.update(id, data);
            return customerRepo.findOneBy({ id });
        });
    }
    static delete(id) {
        return customerRepo.delete(id);
    }
}
exports.CustomerService = CustomerService;
