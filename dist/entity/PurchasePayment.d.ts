import { PurchaseInvoice } from "./PurchaseInvoice";
import { Account } from "./Account";
export declare class PurchasePayment {
    id: number;
    paymentNumber: string;
    paymentDate: Date;
    amount: number;
    purchaseInvoice: PurchaseInvoice;
    purchaseInvoiceId: number;
    paymentAccount: Account;
    paymentAccountId: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=PurchasePayment.d.ts.map