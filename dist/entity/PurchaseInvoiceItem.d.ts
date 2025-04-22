import { Product } from "./Product";
import { PurchaseInvoice } from "./PurchaseInvoice";
export declare class PurchaseInvoiceItem {
    id: string;
    purchaseInvoice: PurchaseInvoice;
    product: Product;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}
//# sourceMappingURL=PurchaseInvoiceItem.d.ts.map