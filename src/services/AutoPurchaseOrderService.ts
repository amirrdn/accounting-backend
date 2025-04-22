import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { StockService } from "./StockService";
import { PurchaseInvoice } from "../entity/PurchaseInvoice";
import { PurchaseInvoiceItem } from "../entity/PurchaseInvoiceItem";
import { Supplier } from "../entity/Supplier";
import { PurchaseInvoiceStatus } from "../entity/PurchaseInvoice";

export class AutoPurchaseOrderService {
  static async generateDraftPurchaseOrder() {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();

    const draftPOs: Record<number, any[]> = {};

    for (const product of products) {
      const stock = await StockService.getCurrentStock(product.id);

      if (stock < product.minimumStock && product.defaultSupplier) {
        const suggestedQty = product.minimumStock - stock;
        const supplierId = product.defaultSupplier.id;

        if (!draftPOs[supplierId]) {
          draftPOs[supplierId] = [];
        }

        draftPOs[supplierId].push({
          productId: product.id,
          productName: product.name,
          qty: suggestedQty,
        });
      }
    }

    const result = Object.entries(draftPOs).map(([supplierId, items]) => ({
      supplierId: +supplierId,
      supplierName: items[0].productName.defaultSupplier.name,
      items,
    }));

    return result;
  }

  static async createPOFromDraft(supplierId: number, items: { productId: number; qty: number }[]) {
    const supplierRepo = AppDataSource.getRepository(Supplier);
    const productRepo = AppDataSource.getRepository(Product);
    const purchaseRepo = AppDataSource.getRepository(PurchaseInvoice);
    const itemRepo = AppDataSource.getRepository(PurchaseInvoiceItem);

    const supplier = await supplierRepo.findOneByOrFail({ id: supplierId });

    const po = await purchaseRepo.save({
      supplier,
      invoiceNumber: `PO-${Date.now()}`,
      invoiceDate: new Date(),
      dueDate: new Date(),
      totalAmount: 0,
      status: PurchaseInvoiceStatus.UNPAID,
      subtotal: 0,
      taxAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      isPpn: false,
      isPph: false,
      ppnRate: 0,
      pphRate: 0
    });

    let total = 0;
    for (const entry of items) {
      const product = await productRepo.findOneByOrFail({ id: entry.productId });
      const unitPrice = product.cost || 0;
      const subtotal = unitPrice * entry.qty;
      total += subtotal;

      await itemRepo.save({
        purchaseInvoice: po as PurchaseInvoice,
        product,
        quantity: entry.qty,
        unitPrice,
        subtotal,
        discount: 0,
        taxAmount: 0,
        total: subtotal
      });
    }

    po.totalAmount = total;
    await purchaseRepo.save(po);

    return { message: "Draft PO created", purchaseId: po.id };
  }
}
