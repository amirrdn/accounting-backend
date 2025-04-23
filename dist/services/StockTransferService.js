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
exports.StockTransferService = void 0;
const data_source_1 = require("../data-source");
const Warehouse_1 = require("../entity/Warehouse");
const StockTransfer_1 = require("../entity/StockTransfer");
const StockTransferItem_1 = require("../entity/StockTransferItem");
const Product_1 = require("../entity/Product");
const StockService_1 = require("./StockService");
const StockMutation_1 = require("../entity/StockMutation");
class StockTransferService {
    static createTransfer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouseRepo = data_source_1.AppDataSource.getRepository(Warehouse_1.Warehouse);
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const transferRepo = data_source_1.AppDataSource.getRepository(StockTransfer_1.StockTransfer);
            const itemRepo = data_source_1.AppDataSource.getRepository(StockTransferItem_1.StockTransferItem);
            const fromWarehouse = yield warehouseRepo.findOneByOrFail({ id: data.fromWarehouseId });
            const toWarehouse = yield warehouseRepo.findOneByOrFail({ id: data.toWarehouseId });
            const transfer = yield transferRepo.save({
                fromWarehouse,
                toWarehouse,
                transferDate: new Date(data.transferDate),
                status: "SENT",
            });
            for (const item of data.items) {
                const product = yield productRepo.findOneByOrFail({ id: item.productId });
                yield itemRepo.save({
                    transfer,
                    product,
                    quantity: item.quantity,
                });
                yield data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation).save({
                    product,
                    quantity: item.quantity,
                    type: "OUT",
                    reference: `TRANSFER-${transfer.id}`,
                    date: new Date(),
                });
                yield data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation).save({
                    product,
                    quantity: item.quantity,
                    type: "IN",
                    reference: `TRANSFER-${transfer.id}`,
                    date: new Date(),
                });
            }
            return transfer;
        });
    }
    static getAllTransfers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.getRepository(StockTransfer_1.StockTransfer).find({
                relations: ["fromWarehouse", "toWarehouse", "items", "items.product"],
                order: { transferDate: "DESC" },
            });
        });
    }
    static markAsReceived(transferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = data_source_1.AppDataSource.getRepository(StockTransfer_1.StockTransfer);
            const transfer = yield repo.findOne({
                where: { id: transferId },
                relations: ["items", "items.product", "toWarehouse"],
            });
            if (!transfer)
                throw new Error("Transfer tidak ditemukan");
            if (transfer.status === "RECEIVED")
                throw new Error("Sudah diterima sebelumnya");
            for (const item of transfer.items) {
                yield StockService_1.StockService.increaseStock(item.product.id, item.quantity, transfer.toWarehouse.id);
            }
            transfer.status = "RECEIVED";
            yield repo.save(transfer);
            return transfer;
        });
    }
}
exports.StockTransferService = StockTransferService;
