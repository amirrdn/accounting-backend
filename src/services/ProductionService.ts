import { AppDataSource } from "../data-source";
import { ProductionOrder } from "../entity/ProductionOrder";
import { BillOfMaterial } from "../entity/BillOfMaterial";
import { StockService } from "./StockService";

export class ProductionService {
  static async createProductionOrder(productId: number, quantity: number, warehouseId: number) {
    const bomRepo = AppDataSource.getRepository(BillOfMaterial);
    const productionRepo = AppDataSource.getRepository(ProductionOrder);

    const bom = await bomRepo.findOne({
      where: { product: { id: productId } },
      relations: ["items", "items.material"]
    });

    if (!bom) throw new Error("BOM tidak ditemukan");

    const order = productionRepo.create({
      product: { id: productId } as any,
      quantity,
      warehouse: { id: warehouseId } as any,
      status: "COMPLETED"
    });
    await productionRepo.save(order);

    for (const item of bom.items) {
      const totalQty = item.quantity * quantity;
      await StockService.adjustStock(item.material.id, warehouseId, -totalQty);
    }

    await StockService.adjustStock(productId, warehouseId, quantity);

    return order;
  }
}
