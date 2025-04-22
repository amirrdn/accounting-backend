import { AppDataSource } from "../data-source";
import { StockAdjustment } from "../entity/StockAdjustment";
import { StockService } from "./StockService";
import { StockMutation } from "../entity/StockMutation";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

interface StockAdjustmentRequest {
  productId: number;
  actualQty: number;
  reason: string;
}

export class StockAdjustmentService {
  static async adjustStock(productId: number, actualQty: number, userId: number, reason: string) {
    const productRepo = AppDataSource.getRepository(Product);
    const userRepo = AppDataSource.getRepository(User);
    const adjustmentRepo = AppDataSource.getRepository(StockAdjustment);
    const mutationRepo = AppDataSource.getRepository(StockMutation);

    const product = await productRepo.findOneByOrFail({ id: productId });
    const user = await userRepo.findOneByOrFail({ id: userId });

    const systemQty = await StockService.getCurrentStock(productId);
    const diff = actualQty - systemQty;

    if (diff === 0) return { message: "No adjustment needed" };

    await adjustmentRepo.save({
      product,
      actualStock: actualQty,
      systemStock: systemQty,
      difference: diff,
      reason,
      adjustedBy: user,
    });

    await mutationRepo.save({
      product,
      quantity: Math.abs(diff),
      type: diff > 0 ? "IN" : "OUT",
      reference: `ADJUSTMENT-${Date.now()}`,
      date: new Date(),
    });

    return { message: "Stock adjusted", difference: diff };
  }

  static async getAdjustments() {
    const repo = AppDataSource.getRepository(StockAdjustment);
    return await repo.find({ order: { adjustedAt: "DESC" } });
  }

  static async approveAdjustment(id: number) {
    const repo = AppDataSource.getRepository(StockAdjustment);
    const adjustment = await repo.findOneByOrFail({ id });
    
    if (adjustment.status === 'APPROVED') {
      throw new Error('Adjustment already approved');
    }

    adjustment.status = 'APPROVED';
    return await repo.save(adjustment);
  }
}
