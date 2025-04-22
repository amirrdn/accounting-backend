import { PurchaseOrder } from "./PurchaseOrder";
import { Branch } from "./Branch";
import { PurchaseReceiptItem } from "./PurchaseReceiptItem";
export declare enum PurchaseReceiptStatus {
    DRAFT = "DRAFT",
    COMPLETED = "COMPLETED"
}
export declare class PurchaseReceipt {
    id: string;
    receiptNumber: string;
    receiptDate: Date;
    purchaseOrder: PurchaseOrder;
    branch: Branch;
    items: PurchaseReceiptItem[];
    status: PurchaseReceiptStatus;
    totalAmount: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=PurchaseReceipt.d.ts.map