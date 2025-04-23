import { Account } from "./Account";
import { Branch } from "./Branch";
export declare class CashBankTransaction {
    id: number;
    date: Date;
    type: "IN" | "OUT" | "TRANSFER";
    amount: number;
    description: string;
    sourceAccount: Account;
    accountId: number;
    destinationAccount: Account;
    destinationAccountId: number;
    isApproved: boolean;
    branch: Branch;
    branchId: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=CashBankTransaction.d.ts.map