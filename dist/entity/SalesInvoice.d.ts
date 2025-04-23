import { Customer } from "./Customer";
import { SalesInvoiceItem } from "./SalesInvoiceItem";
import { Account } from "./Account";
import { Branch } from "./Branch";
export declare class SalesInvoice {
    id: number;
    invoice_number: string;
    date: Date;
    customer: Customer;
    receivableAccount: Account;
    total: number;
    items: SalesInvoiceItem[];
    branch: Branch;
    createdAt: Date;
    updatedAt: Date;
    notes: string;
}
//# sourceMappingURL=SalesInvoice.d.ts.map