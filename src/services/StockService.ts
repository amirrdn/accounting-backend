import { AppDataSource } from "../data-source";
import { StockMutation } from "../entity/StockMutation";
import { PurchaseInvoice } from "../entity/PurchaseInvoice";
import { SalesInvoice } from "../entity/SalesInvoice";
import { ProductStock } from "../entity/ProductStock";
import { Product } from "../entity/Product";
import { Warehouse } from "../entity/Warehouse";
import { Stock } from "../entity/Stock";

export class StockService {
  static async createFromPurchaseInvoice(invoice: PurchaseInvoice) {
    const repo = AppDataSource.getRepository(StockMutation);

    for (const item of invoice.items) {
      await repo.save({
        product: item.product,
        quantity: item.quantity,
        type: "IN",
        reference: invoice.invoiceNumber,
        date: invoice.invoiceDate,
      });
    }
  }

  static async createFromSalesInvoice(invoice: SalesInvoice) {
    const repo = AppDataSource.getRepository(StockMutation);

    for (const item of invoice.items) {
      await repo.save({
        product: item.product,
        quantity: item.quantity,
        type: "OUT",
        reference: invoice.invoice_number,
        date: invoice.date,
      });
    }
  }

  static async getCurrentStock(productId: number) {
    const repo = AppDataSource.getRepository(StockMutation);
    const all = await repo.find({
      where: { product: { id: productId } },
    });

    const total = all.reduce((sum, s) => {
      return sum + (s.type === "IN" ? s.quantity : -s.quantity);
    }, 0);

    return total;
  }

  static async getStockCard(productId: number) {
    const repo = AppDataSource.getRepository(StockMutation);
    return await repo.find({
      where: { product: { id: productId } },
      order: { date: "ASC" },
    });
  }

  static async increaseStock(productId: number, qty: number, warehouseId: number) {
    const stockRepo = AppDataSource.getRepository(ProductStock);
    let stock = await stockRepo.findOne({
      where: {
        product: { id: productId },
        warehouse: { id: warehouseId },
      },
      relations: ["product", "warehouse"],
    });

    if (!stock) {
      const product = await AppDataSource.getRepository(Product).findOneByOrFail({ id: productId });
      const warehouse = await AppDataSource.getRepository(Warehouse).findOneByOrFail({ id: warehouseId });

      stock = stockRepo.create({ product, warehouse, quantity: qty });
    } else {
      stock.quantity += qty;
    }

    await stockRepo.save(stock);
  }

  static async decreaseStock(productId: number, qty: number, warehouseId: number) {
    const stockRepo = AppDataSource.getRepository(ProductStock);
    const stock = await stockRepo.findOne({
      where: {
        product: { id: productId },
        warehouse: { id: warehouseId },
      },
      relations: ["product", "warehouse"],
    });

    if (!stock || stock.quantity < qty) {
      throw new Error("Stok tidak cukup atau belum tersedia");
    }

    stock.quantity -= qty;
    await stockRepo.save(stock);
  }

  static async getStock(productId: number, warehouseId: number) {
    const stockRepo = AppDataSource.getRepository(ProductStock);
    const stock = await stockRepo.findOne({
      where: {
        product: { id: productId },
        warehouse: { id: warehouseId },
      },
      relations: ["product", "warehouse"],
    });

    return stock?.quantity || 0;
  }
  static async adjustStock(productId: number, warehouseId: number, qtyDiff: number) {
    const repo = AppDataSource.getRepository(Stock);
    let stock = await repo.findOne({
      where: {
        product: { id: productId },
        warehouse: { id: warehouseId },
      },
      relations: ["product", "warehouse"],
    });

    if (!stock) {
      stock = repo.create({
        product: { id: productId } as any,
        warehouse: { id: warehouseId } as any,
        quantity: qtyDiff,
      });
    } else {
      stock.quantity += qtyDiff;
    }

    await repo.save(stock);
  }
}
