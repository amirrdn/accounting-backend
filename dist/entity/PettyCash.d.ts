import { User } from "./User";
export declare class PettyCash {
    id: number;
    transactionDate: Date;
    description: string;
    amount: number;
    type: "IN" | "OUT";
    receiptNumber: string;
    attachmentUrl: string;
    requestedBy: User;
    approvedBy: User;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=PettyCash.d.ts.map