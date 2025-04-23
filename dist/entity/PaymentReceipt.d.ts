import { Customer } from "./Customer";
import { SalesInvoice } from "./SalesInvoice";
import { Account } from "./Account";
export declare class PaymentReceipt {
    id: number;
    paymentNumber: string;
    date: Date;
    amount: number;
    customer: Customer;
    invoice: SalesInvoice;
    cashAccount: Account;
    note: string;
}
//# sourceMappingURL=PaymentReceipt.d.ts.map