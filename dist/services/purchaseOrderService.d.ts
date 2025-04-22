import { PurchaseOrder } from "../entity/PurchaseOrder";
import { PurchaseOrderStatus } from "../entity/PurchaseOrder";
export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class PurchaseOrderService {
    private purchaseOrderRepository;
    private purchaseOrderItemRepository;
    private productRepository;
    private supplierRepository;
    private branchRepository;
    private uploadDir;
    constructor();
    private saveFile;
    createPurchaseOrder(data: any, file?: UploadedFile): Promise<PurchaseOrder>;
    updatePurchaseOrder(id: string, data: any, file?: UploadedFile): Promise<PurchaseOrder>;
    getPurchaseOrders(): Promise<PurchaseOrder[]>;
    getPurchaseOrderById(id: string): Promise<PurchaseOrder>;
    updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus, userId: number, approvalNotes?: string): Promise<PurchaseOrder>;
    deletePurchaseOrder(id: string): Promise<PurchaseOrder>;
}
//# sourceMappingURL=purchaseOrderService.d.ts.map