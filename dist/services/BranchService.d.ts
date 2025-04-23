import { Branch } from "../entity/Branch";
export declare class BranchService {
    private branchRepository;
    constructor();
    create(data: Partial<Branch>): Promise<Branch>;
    findAll(): Promise<Branch[]>;
    findOne(id: number): Promise<Branch | null>;
    update(id: number, data: Partial<Branch>): Promise<Branch | null>;
    delete(id: number): Promise<void>;
    getTransactionsByBranch(branchId: number, startDate: Date, endDate: Date): Promise<Branch | null>;
    getConsolidatedReport(startDate: Date, endDate: Date): Promise<Branch[]>;
}
//# sourceMappingURL=BranchService.d.ts.map