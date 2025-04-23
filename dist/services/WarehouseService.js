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
exports.WarehouseService = void 0;
const Warehouse_1 = require("../entity/Warehouse");
const data_source_1 = require("../data-source");
class WarehouseService {
    constructor() {
        this.warehouseRepository = data_source_1.AppDataSource.getRepository(Warehouse_1.Warehouse);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.warehouseRepository.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.warehouseRepository.findOneBy({ id });
        });
    }
    create(warehouseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouse = this.warehouseRepository.create(warehouseData);
            return this.warehouseRepository.save(warehouse);
        });
    }
    update(id, warehouseData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.warehouseRepository.update(id, warehouseData);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.warehouseRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        });
    }
}
exports.WarehouseService = WarehouseService;
