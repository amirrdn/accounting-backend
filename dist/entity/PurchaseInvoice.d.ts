import { Supplier } from "./Supplier";
import { PurchaseInvoiceItem } from "./PurchaseInvoiceItem";
import { Account } from "./Account";
import { Branch } from "./Branch";
import { PurchaseOrder } from "./PurchaseOrder";
import { PurchaseReceipt } from "./PurchaseReceipt";
import { PurchasePayment } from "./PurchasePayment";
export declare enum PurchaseInvoiceStatus {
    UNPAID = "UNPAID",
    PAID_PARTIAL = "PAID_PARTIAL",
    PAID_FULL = "PAID_FULL"
}
export declare class PurchaseInvoice {
    id: number;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    supplier: Supplier;
    purchaseOrder: PurchaseOrder;
    purchaseReceipt: PurchaseReceipt;
    items: PurchaseInvoiceItem[];
    payments: PurchasePayment[];
    status: PurchaseInvoiceStatus;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    isPpn: boolean;
    isPph: boolean;
    ppnRate: number;
    pphRate: number;
    notes: string;
    attachmentUrl: string;
    createdAt: Date;
    updatedAt: Date;
    payableAccount: Account;
    total: number;
    branch: Branch;
}
//# sourceMappingURL=PurchaseInvoice.d.ts.map