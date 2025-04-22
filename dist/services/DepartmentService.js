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
exports.DepartmentService = void 0;
const Department_1 = require("../entity/Department");
const data_source_1 = require("../data-source");
class DepartmentService {
    constructor() {
        this.departmentRepository = data_source_1.AppDataSource.getRepository(Department_1.Department);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.departmentRepository.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.departmentRepository.findOneBy({ id });
        });
    }
    create(departmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = this.departmentRepository.create(departmentData);
            return this.departmentRepository.save(department);
        });
    }
    update(id, departmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.departmentRepository.update(id, departmentData);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.departmentRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        });
    }
}
exports.DepartmentService = DepartmentService;
