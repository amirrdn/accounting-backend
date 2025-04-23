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
exports.AddWarehouiseIDPurchaseRequest1745045267879 = void 0;
class AddWarehouiseIDPurchaseRequest1745045267879 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`    
            ALTER TABLE purchase_request
            ADD COLUMN warehouse_id INT NULL
          `);
            yield queryRunner.query(`
            ALTER TABLE purchase_request
            ADD CONSTRAINT FK_warehouse FOREIGN KEY (warehouse_id)
            REFERENCES warehouse(id) ON DELETE SET NULL
          `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE purchase_request
            DROP COLUMN warehouse_id
        `);
        });
    }
}
exports.AddWarehouiseIDPurchaseRequest1745045267879 = AddWarehouiseIDPurchaseRequest1745045267879;
