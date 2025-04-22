import { Supplier } from "./Supplier";
import { PurchaseInvoice } from "./PurchaseInvoice";
import { Account } from "./Account";
export declare class PaymentExpense {
    id: number;
    paymentNumber: string;
    date: Date;
    amount: number;
    supplier: Supplier;
    invoice: PurchaseInvoice;
    cashAccount: Account;
    note: string;
}
//# sourceMappingURL=PaymentExpense.d.ts.map