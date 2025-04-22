import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { StockMutation } from "../entity/StockMutation";
import { PurchaseInvoiceItem } from "../entity/PurchaseInvoiceItem";

export class InventoryReportService {
  static async getInventoryValueReport() {
    const productRepo = AppDataSource.getRepository(Product);
    const mutationRepo = AppDataSource.getRepository(StockMutation);
    const purchaseItemRepo = AppDataSource.getRepository(PurchaseInvoiceItem);

    const products = await productRepo.find();

    const results = [];

    for (const product of products) {
      const mutations = await mutationRepo.find({
        where: { product: { id: product.id } },
      });

      const stock = mutations.reduce((sum, m) => {
        return sum + (m.type === "IN" ? m.quantity : -m.quantity);
      }, 0);

      if (stock === 0) continue;

      const lastPurchaseItem = await purchaseItemRepo.findOne({
        where: { product: { id: product.id } },
        order: { id: "DESC" },
        relations: ["purchaseInvoice"],
      });

      const lastPrice = lastPurchaseItem?.unitPrice || 0;

      results.push({
        productId: product.id,
        productName: product.name,
        stock,
        lastPurchasePrice: lastPrice,
        inventoryValue: stock * lastPrice,
      });
    }

    return results;
  }
}
