import { AppDataSource } from "../data-source";
import { StockOpname } from "../entity/StockOpname";
import { StockOpnameItem } from "../entity/StockOpnameItem";
import { StockService } from "./StockService";
import { JournalHelper } from "../utils/JournalHelper";
import { Account } from "../entity/Account";
import { StockMutation } from "../entity/StockMutation";
import { Warehouse } from "../entity/Warehouse";

export class StockOpnameService {
  static async createStockOpname(warehouseId: number, items: { productId: number; actualQty: number }[]) {
    const opnameRepo = AppDataSource.getRepository(StockOpname);
    const opnameItemRepo = AppDataSource.getRepository(StockOpnameItem);
    const stockMutationRepo = AppDataSource.getRepository(StockMutation);
    const warehouseRepo = AppDataSource.getRepository(Warehouse);

    const warehouse = await warehouseRepo.findOneByOrFail({ id: warehouseId });

    const opname = new StockOpname();
    opname.warehouse = warehouse;
    opname.date = new Date();
    opname.items = [];

    for (const item of items) {
      const systemQty = await StockService.getCurrentStock(item.productId);
      const diffQty = item.actualQty - systemQty;

      const opnameItem = new StockOpnameItem();
      opnameItem.product = { id: item.productId } as any;
      opnameItem.actualQty = item.actualQty;
      opnameItem.systemQty = systemQty;
      opnameItem.diffQty = diffQty;

      opname.items.push(opnameItem);

      if (diffQty !== 0) {
        await stockMutationRepo.save({
          product: { id: item.productId },
          quantity: Math.abs(diffQty),
          type: diffQty > 0 ? "IN" : "OUT",
          reference: `STOCK_OPNAME-${opname.id}`,
          date: new Date(),
        });
      }

      if (diffQty !== 0) {
        await JournalHelper.createJournal({
          reference: `STOCK_OPNAME-${opname.id}`,
          date: new Date(),
          description: `Penyesuaian stok Product ${item.productId}`,
          entries: [
            {
              accountId: diffQty > 0 ? 1 : 2,
              debit: diffQty > 0 ? 0 : Math.abs(diffQty * 1000),
              credit: diffQty > 0 ? Math.abs(diffQty * 1000) : 0,
            },
            {
              accountId: 3,
              debit: diffQty > 0 ? Math.abs(diffQty * 1000) : 0,
              credit: diffQty > 0 ? 0 : Math.abs(diffQty * 1000),
            },
          ],
        });
      }
    }

    return await opnameRepo.save(opname);
  }
}
