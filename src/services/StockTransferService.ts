import { AppDataSource } from "../data-source";
import { Warehouse } from "../entity/Warehouse";
import { StockTransfer } from "../entity/StockTransfer";
import { StockTransferItem } from "../entity/StockTransferItem";
import { Product } from "../entity/Product";
import { StockService } from "./StockService";
import { StockMutation } from "../entity/StockMutation";

export class StockTransferService {
  static async createTransfer(data: {
    fromWarehouseId: number;
    toWarehouseId: number;
    transferDate: string;
    items: { productId: number; quantity: number }[];
  }) {
    const warehouseRepo = AppDataSource.getRepository(Warehouse);
    const productRepo = AppDataSource.getRepository(Product);
    const transferRepo = AppDataSource.getRepository(StockTransfer);
    const itemRepo = AppDataSource.getRepository(StockTransferItem);

    const fromWarehouse = await warehouseRepo.findOneByOrFail({ id: data.fromWarehouseId });
    const toWarehouse = await warehouseRepo.findOneByOrFail({ id: data.toWarehouseId });

    const transfer = await transferRepo.save({
      fromWarehouse,
      toWarehouse,
      transferDate: new Date(data.transferDate),
      status: "SENT",
    });

    for (const item of data.items) {
      const product = await productRepo.findOneByOrFail({ id: item.productId });

      await itemRepo.save({
        transfer,
        product,
        quantity: item.quantity,
      });

      await AppDataSource.getRepository(StockMutation).save({
        product,
        quantity: item.quantity,
        type: "OUT",
        reference: `TRANSFER-${transfer.id}`,
        date: new Date(),
      });
      await AppDataSource.getRepository(StockMutation).save({
        product,
        quantity: item.quantity,
        type: "IN",
        reference: `TRANSFER-${transfer.id}`,
        date: new Date(),
      });
    }

    return transfer;
  }

  static async getAllTransfers() {
    return await AppDataSource.getRepository(StockTransfer).find({
      relations: ["fromWarehouse", "toWarehouse", "items", "items.product"],
      order: { transferDate: "DESC" },
    });
  }
  static async markAsReceived(transferId: number) {
    const repo = AppDataSource.getRepository(StockTransfer);
    const transfer = await repo.findOne({
      where: { id: transferId },
      relations: ["items", "items.product", "toWarehouse"],
    });

    if (!transfer) throw new Error("Transfer tidak ditemukan");
    if (transfer.status === "RECEIVED") throw new Error("Sudah diterima sebelumnya");

    for (const item of transfer.items) {
      await StockService.increaseStock(item.product.id, item.quantity, transfer.toWarehouse.id);
    }

    transfer.status = "RECEIVED";
    await repo.save(transfer);

    return transfer;
  }
}
