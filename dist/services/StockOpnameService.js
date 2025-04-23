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
exports.StockOpnameService = void 0;
const data_source_1 = require("../data-source");
const StockOpname_1 = require("../entity/StockOpname");
const StockOpnameItem_1 = require("../entity/StockOpnameItem");
const StockService_1 = require("./StockService");
const JournalHelper_1 = require("../utils/JournalHelper");
const StockMutation_1 = require("../entity/StockMutation");
const Warehouse_1 = require("../entity/Warehouse");
class StockOpnameService {
    static createStockOpname(warehouseId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const opnameRepo = data_source_1.AppDataSource.getRepository(StockOpname_1.StockOpname);
            const opnameItemRepo = data_source_1.AppDataSource.getRepository(StockOpnameItem_1.StockOpnameItem);
            const stockMutationRepo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
            const warehouseRepo = data_source_1.AppDataSource.getRepository(Warehouse_1.Warehouse);
            const warehouse = yield warehouseRepo.findOneByOrFail({ id: warehouseId });
            const opname = new StockOpname_1.StockOpname();
            opname.warehouse = warehouse;
            opname.date = new Date();
            opname.items = [];
            for (const item of items) {
                const systemQty = yield StockService_1.StockService.getCurrentStock(item.productId);
                const diffQty = item.actualQty - systemQty;
                const opnameItem = new StockOpnameItem_1.StockOpnameItem();
                opnameItem.product = { id: item.productId };
                opnameItem.actualQty = item.actualQty;
                opnameItem.systemQty = systemQty;
                opnameItem.diffQty = diffQty;
                opname.items.push(opnameItem);
                if (diffQty !== 0) {
                    yield stockMutationRepo.save({
                        product: { id: item.productId },
                        quantity: Math.abs(diffQty),
                        type: diffQty > 0 ? "IN" : "OUT",
                        reference: `STOCK_OPNAME-${opname.id}`,
                        date: new Date(),
                    });
                }
                if (diffQty !== 0) {
                    yield JournalHelper_1.JournalHelper.createJournal({
                        reference: `STOCK_OPNAME-${opname.id}`,
                        date: new Date(),
                        description: `Penyesuaian stok Product ${item.productId}`,
                        entries: [
                            {
                                accountId: diffQty > 0 ? 1 : 2,
                                debit: diffQty > 0 ? 0 : Math.abs(diffQty * 1000),
                                credit: diffQty > 0 ? Math.abs(diffQty * 1000) : 0,
                            },
                            {
                                accountId: 3,
                                debit: diffQty > 0 ? Math.abs(diffQty * 1000) : 0,
                                credit: diffQty > 0 ? 0 : Math.abs(diffQty * 1000),
                            },
                        ],
                    });
                }
            }
            return yield opnameRepo.save(opname);
        });
    }
}
exports.StockOpnameService = StockOpnameService;
