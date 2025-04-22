import { PettyCash } from "../entity/PettyCash";
import { User } from "../entity/User";
export declare class PettyCashService {
    private pettyCashRepository;
    constructor();
    create(data: {
        transactionDate: Date;
        description: string;
        amount: number;
        type: "IN" | "OUT";
        receiptNumber?: string;
        attachmentUrl?: string;
        requestedBy: User;
    }): Promise<PettyCash>;
    findAll(options?: {
        status?: "PENDING" | "APPROVED" | "REJECTED";
        type?: "IN" | "OUT";
        startDate?: Date;
        endDate?: Date;
    }): Promise<PettyCash[]>;
    findById(id: number): Promise<PettyCash | null>;
    approve(id: number, approver: User): Promise<PettyCash>;
    reject(id: number, approver: User): Promise<PettyCash>;
    getBalance(): Promise<number>;
}
//# sourceMappingURL=PettyCashService.d.ts.map