export declare class AutoPurchaseOrderService {
    static generateDraftPurchaseOrder(): Promise<{
        supplierId: number;
        supplierName: any;
        items: any[];
    }[]>;
    static createPOFromDraft(supplierId: number, items: {
        productId: number;
        qty: number;
    }[]): Promise<{
        message: string;
        purchaseId: number;
    }>;
}
//# sourceMappingURL=AutoPurchaseOrderService.d.ts.map