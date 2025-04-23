import { Supplier } from "./Supplier";
import { Branch } from "./Branch";
import { PurchaseOrderItem } from "./PurchaseOrderItem";
import { User } from "./User";
export declare enum PurchaseOrderStatus {
    DRAFT = "DRAFT",
    APPROVED = "APPROVED",
    SENT = "SENT",
    RECEIVED_PARTIAL = "RECEIVED_PARTIAL",
    RECEIVED_FULL = "RECEIVED_FULL"
}
export declare class PurchaseOrder {
    id: string;
    poNumber: string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    supplier: Supplier;
    branch: Branch;
    items: PurchaseOrderItem[];
    status: PurchaseOrderStatus;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    isPpn: boolean;
    isPph: boolean;
    ppnRate: number;
    pphRate: number;
    notes: string;
    attachmentUrl: string;
    approvalNotes: string;
    approvalDate: Date;
    approvedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=PurchaseOrder.d.ts.map