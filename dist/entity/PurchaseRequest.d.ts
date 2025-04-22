import { User } from "./User";
import { Branch } from "./Branch";
import { PurchaseRequestItem } from "./PurchaseRequestItem";
import { Warehouse } from "./Warehouse";
export declare enum PurchaseRequestStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum RejectionReason {
    BUDGET_EXCEEDED = "BUDGET_EXCEEDED",
    SUPPLIER_ISSUE = "SUPPLIER_ISSUE",
    STOCK_AVAILABLE = "STOCK_AVAILABLE",
    OTHER = "OTHER"
}
export declare class PurchaseRequest {
    id: string;
    requestNumber: string;
    requestDate: Date;
    department: string;
    requestedBy: User;
    branch: Branch;
    items: PurchaseRequestItem[];
    status: PurchaseRequestStatus;
    notes: string;
    approvalNotes: string;
    approvalDate: Date;
    budgetCheck: string;
    stockCheck: string;
    supplierCheck: string;
    approvedBy: User;
    warehouse: Warehouse;
    rejectionNotes: string;
    rejectionDate: Date;
    rejectionReason: RejectionReason;
    rejectedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=PurchaseRequest.d.ts.map