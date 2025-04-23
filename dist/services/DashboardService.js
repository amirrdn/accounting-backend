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
exports.DashboardService = void 0;
const data_source_1 = require("../data-source");
const Account_1 = require("../entity/Account");
const JournalEntry_1 = require("../entity/JournalEntry");
const Product_1 = require("../entity/Product");
const PurchaseInvoice_1 = require("../entity/PurchaseInvoice");
const SalesInvoice_1 = require("../entity/SalesInvoice");
const Stock_1 = require("../entity/Stock");
const Warehouse_1 = require("../entity/Warehouse");
class DashboardService {
    static getStockSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const warehouseRepo = data_source_1.AppDataSource.getRepository(Warehouse_1.Warehouse);
            const totalProducts = yield productRepo.count();
            const stockData = yield stockRepo.find({ relations: ["product", "warehouse"] });
            let totalStockValue = 0;
            const stockPerWarehouse = {};
            const lowStockItems = [];
            for (const item of stockData) {
                const product = item.product;
                const qty = item.quantity;
                const value = qty * product.cost;
                totalStockValue += value;
                if (qty <= product.minimumStock) {
                    lowStockItems.push({ id: product.id, name: product.name, qty });
                }
                stockPerWarehouse[item.warehouse.id] = (stockPerWarehouse[item.warehouse.id] || 0) + qty;
            }
            const warehouseList = yield warehouseRepo.find();
            const stockPerWarehouseArray = warehouseList.map((w) => ({
                warehouse: w.name,
                totalQty: stockPerWarehouse[w.id] || 0,
            }));
            return {
                totalProducts,
                totalStockValue,
                lowStockItems,
                stockPerWarehouse: stockPerWarehouseArray,
            };
        });
    }
    static getFinanceSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const salesRepo = data_source_1.AppDataSource.getRepository(SalesInvoice_1.SalesInvoice);
            const purchaseRepo = data_source_1.AppDataSource.getRepository(PurchaseInvoice_1.PurchaseInvoice);
            const journalRepo = data_source_1.AppDataSource.getRepository(JournalEntry_1.JournalEntry);
            const accountRepo = data_source_1.AppDataSource.getRepository(Account_1.Account);
            const [totalSalesResult, totalPurchaseResult] = yield Promise.all([
                salesRepo
                    .createQueryBuilder("invoice")
                    .select("SUM(invoice.total)", "total")
                    .where("invoice.status = :status", { status: "PAID" })
                    .getRawOne(),
                purchaseRepo
                    .createQueryBuilder("invoice")
                    .select("SUM(invoice.total)", "total")
                    .where("invoice.status = :status", { status: "PAID" })
                    .getRawOne(),
            ]);
            const totalSales = parseFloat(totalSalesResult.total) || 0;
            const totalPurchases = parseFloat(totalPurchaseResult.total) || 0;
            const grossProfit = totalSales - totalPurchases;
            const cashAccounts = yield accountRepo.find({
                where: [{ type: "cash" }, { type: "bank" }]
            });
            let cashBalance = 0;
            for (const account of cashAccounts) {
                const sum = yield journalRepo
                    .createQueryBuilder("j")
                    .select("SUM(j.debit - j.credit)", "balance")
                    .where("j.accountId = :id", { id: account.id })
                    .getRawOne();
                cashBalance += parseFloat(sum.balance) || 0;
            }
            const arAccount = yield accountRepo.findOneBy({ code: "AR" });
            const apAccount = yield accountRepo.findOneBy({ code: "AP" });
            const accountsReceivable = arAccount
                ? parseFloat((yield journalRepo
                    .createQueryBuilder("j")
                    .select("SUM(j.debit - j.credit)", "balance")
                    .where("j.accountId = :id", { id: arAccount.id })
                    .getRawOne()).balance) || 0
                : 0;
            const accountsPayable = apAccount
                ? parseFloat((yield journalRepo
                    .createQueryBuilder("j")
                    .select("SUM(j.credit - j.debit)", "balance")
                    .where("j.accountId = :id", { id: apAccount.id })
                    .getRawOne()).balance) || 0
                : 0;
            return {
                totalSales,
                totalPurchases,
                grossProfit,
                cashBalance,
                accountsReceivable,
                accountsPayable
            };
        });
    }
}
exports.DashboardService = DashboardService;
