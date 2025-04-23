import { StockMutation } from "../entity/StockMutation";
import { PurchaseInvoice } from "../entity/PurchaseInvoice";
import { SalesInvoice } from "../entity/SalesInvoice";
export declare class StockService {
    static createFromPurchaseInvoice(invoice: PurchaseInvoice): Promise<void>;
    static createFromSalesInvoice(invoice: SalesInvoice): Promise<void>;
    static getCurrentStock(productId: number): Promise<number>;
    static getStockCard(productId: number): Promise<StockMutation[]>;
    static increaseStock(productId: number, qty: number, warehouseId: number): Promise<void>;
    static decreaseStock(productId: number, qty: number, warehouseId: number): Promise<void>;
    static getStock(productId: number, warehouseId: number): Promise<number>;
    static adjustStock(productId: number, warehouseId: number, qtyDiff: number): Promise<void>;
}
//# sourceMappingURL=StockService.d.ts.map