import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { StockService } from "./StockService";

export class StockAlertService {
  static async getLowStockProducts() {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();

    const alerts = [];

    for (const product of products) {
      const currentStock = await StockService.getCurrentStock(product.id);

      if (currentStock < product.minimumStock) {
        alerts.push({
          productId: product.id,
          productName: product.name,
          currentStock,
          minimumStock: product.minimumStock,
          suggestedQty: product.minimumStock - currentStock,
        });
      }
    }

    return alerts;
  }
}
