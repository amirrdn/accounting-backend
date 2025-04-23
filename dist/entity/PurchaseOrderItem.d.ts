import { Product } from "./Product";
import { PurchaseOrder } from "./PurchaseOrder";
export declare class PurchaseOrderItem {
    id: string;
    purchaseOrder: PurchaseOrder;
    product: Product;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}
//# sourceMappingURL=PurchaseOrderItem.d.ts.map