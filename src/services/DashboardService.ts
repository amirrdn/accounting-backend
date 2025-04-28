import { AppDataSource } from "../data-source";
import { Account } from "../entity/Account";
import { JournalEntry } from "../entity/JournalEntry";
import { JournalDetail } from "../entity/JournalDetail";
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

    // Get all products with their stocks
    const products = await productRepo.find({
      relations: ["stocks", "stocks.warehouse"]
    });

    const totalProducts = products.length;
    let totalStockValue = 0;
    const stockPerWarehouse: { [key: string]: number } = {};
    const lowStockItems: { id: number; name: string; qty: number }[] = [];

    // Calculate stock values and low stock items
    products.forEach(product => {
      product.stocks?.forEach(stock => {
        const qty = stock.quantity || 0;
        const value = qty * (product.cost || 0);
        totalStockValue += value;

        // Add to warehouse stock count
        const warehouseName = stock.warehouse?.name || 'Unknown';
        stockPerWarehouse[warehouseName] = (stockPerWarehouse[warehouseName] || 0) + qty;

        // Check for low stock
        if (qty <= (product.minimumStock || 0)) {
          lowStockItems.push({
            id: product.id,
            name: product.name,
            qty: qty
          });
        }
      });
    });

    // Get all warehouses and format the response
    const warehouses = await warehouseRepo.find();
    const stockPerWarehouseArray = warehouses.map(warehouse => ({
      warehouse: warehouse.name,
      stock: stockPerWarehouse[warehouse.name] || 0
    }));

    return {
      totalProducts,
      totalStockValue,
      stockPerWarehouse: stockPerWarehouseArray,
      lowStockItems
    };
  }

  static async getFinanceSummary() {
    const salesRepo = AppDataSource.getRepository(SalesInvoice);
    const purchaseRepo = AppDataSource.getRepository(PurchaseInvoice);
    const journalDetailRepo = AppDataSource.getRepository(JournalDetail);
    const accountRepo = AppDataSource.getRepository(Account);

    // Get total sales and purchases
    const [totalSalesResult, totalPurchaseResult] = await Promise.all([
      salesRepo
        .createQueryBuilder("invoice")
        .select("COALESCE(SUM(invoice.total), 0)", "total")
        .getRawOne(),

      purchaseRepo
        .createQueryBuilder("invoice")
        .select("COALESCE(SUM(invoice.total), 0)", "total")
        .getRawOne(),
    ]);

    const totalSales = parseFloat(totalSalesResult.total) || 0;
    const totalPurchases = parseFloat(totalPurchaseResult.total) || 0;
    const grossProfit = totalSales - totalPurchases;

    // Get cash accounts
    const cashAccounts = await accountRepo.find({
      where: [{ type: "cash" }, { type: "bank" }]
    });

    // Calculate cash balance
    let cashBalance = 0;
    for (const account of cashAccounts) {
      const result = await journalDetailRepo
        .createQueryBuilder("detail")
        .select("COALESCE(SUM(detail.debit - detail.credit), 0)", "balance")
        .where("detail.accountId = :accountId", { accountId: account.id })
        .getRawOne();
      
      cashBalance += parseFloat(result.balance) || 0;
    }

    // Get AR and AP accounts
    const arAccount = await accountRepo.findOneBy({ code: "AR" });
    const apAccount = await accountRepo.findOneBy({ code: "AP" });

    // Calculate accounts receivable
    let accountsReceivable = 0;
    if (arAccount) {
      const arResult = await journalDetailRepo
        .createQueryBuilder("detail")
        .select("COALESCE(SUM(detail.debit - detail.credit), 0)", "balance")
        .where("detail.accountId = :accountId", { accountId: arAccount.id })
        .getRawOne();
      
      accountsReceivable = parseFloat(arResult.balance) || 0;
    }

    // Calculate accounts payable
    let accountsPayable = 0;
    if (apAccount) {
      const apResult = await journalDetailRepo
        .createQueryBuilder("detail")
        .select("COALESCE(SUM(detail.credit - detail.debit), 0)", "balance")
        .where("detail.accountId = :accountId", { accountId: apAccount.id })
        .getRawOne();
      
      accountsPayable = parseFloat(apResult.balance) || 0;
    }

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
