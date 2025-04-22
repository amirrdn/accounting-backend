import { AppDataSource } from "../data-source";
import { Account } from "../entity/Account";
import { JournalEntry } from "../entity/JournalEntry";
import { Product } from "../entity/Product";
import { PurchaseInvoice } from "../entity/PurchaseInvoice";
import { SalesInvoice } from "../entity/SalesInvoice";
import { Stock } from "../entity/Stock";
import { Warehouse } from "../entity/Warehouse";

export class DashboardService {
  static async getStockSummary() {
    const productRepo = AppDataSource.getRepository(Product);
    const stockRepo = AppDataSource.getRepository(Stock);
    const warehouseRepo = AppDataSource.getRepository(Warehouse);

    const totalProducts = await productRepo.count();

    const stockData = await stockRepo.find({ relations: ["product", "warehouse"] });

    let totalStockValue = 0;
    const stockPerWarehouse: { [key: number]: number } = {};
    const lowStockItems: { id: number; name: string; qty: number }[] = [];

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

    const warehouseList = await warehouseRepo.find();
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
  }

  static async getFinanceSummary() {
    const salesRepo = AppDataSource.getRepository(SalesInvoice);
    const purchaseRepo = AppDataSource.getRepository(PurchaseInvoice);
    const journalRepo = AppDataSource.getRepository(JournalEntry);
    const accountRepo = AppDataSource.getRepository(Account);

    const [totalSalesResult, totalPurchaseResult] = await Promise.all([
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

    const cashAccounts = await accountRepo.find({
      where: [{ type: "cash" }, { type: "bank" }]
    });

    let cashBalance = 0;
    for (const account of cashAccounts) {
      const sum = await journalRepo
        .createQueryBuilder("j")
        .select("SUM(j.debit - j.credit)", "balance")
        .where("j.accountId = :id", { id: account.id })
        .getRawOne();
      cashBalance += parseFloat(sum.balance) || 0;
    }

    const arAccount = await accountRepo.findOneBy({ code: "AR" });
    const apAccount = await accountRepo.findOneBy({ code: "AP" });

    const accountsReceivable = arAccount
      ? parseFloat(
          (
            await journalRepo
              .createQueryBuilder("j")
              .select("SUM(j.debit - j.credit)", "balance")
              .where("j.accountId = :id", { id: arAccount.id })
              .getRawOne()
          ).balance
        ) || 0
      : 0;

    const accountsPayable = apAccount
      ? parseFloat(
          (
            await journalRepo
              .createQueryBuilder("j")
              .select("SUM(j.credit - j.debit)", "balance")
              .where("j.accountId = :id", { id: apAccount.id })
              .getRawOne()
          ).balance
        ) || 0
      : 0;

    return {
      totalSales,
      totalPurchases,
      grossProfit,
      cashBalance,
      accountsReceivable,
      accountsPayable
    };
  }
}
