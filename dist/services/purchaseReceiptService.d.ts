import { PurchaseReceipt, PurchaseReceiptStatus } from "../entity/PurchaseReceipt";
import { CreatePurchaseReceiptDto } from "../types/purchase-receipt.dto";
export declare class PurchaseReceiptService {
    private purchaseReceiptRepository;
    private purchaseReceiptItemRepository;
    private purchaseOrderRepository;
    private branchRepository;
    private productRepository;
    private userRepository;
    constructor();
    private generateReceiptNumber;
    createReceipt(data: CreatePurchaseReceiptDto): Promise<PurchaseReceipt>;
    getReceipts(): Promise<PurchaseReceipt[]>;
    getReceiptById(id: string): Promise<PurchaseReceipt>;
    updateReceipt(id: string, data: {
        receiptDate?: Date;
        notes?: string;
        items?: {
            productId: number;
            quantity: number;
            unitPrice: number;
        }[];
    }): Promise<PurchaseReceipt>;
    deleteReceipt(id: string): Promise<void>;
    updateReceiptStatus(id: string, status: PurchaseReceiptStatus): Promise<PurchaseReceipt>;
    filterReceipts(filters: {
        startDate?: Date;
        endDate?: Date;
        branchId?: number;
        supplierId?: number;
        status?: PurchaseReceiptStatus;
    }): Promise<PurchaseReceipt[]>;
}
//# sourceMappingURL=purchaseReceiptService.d.ts.map