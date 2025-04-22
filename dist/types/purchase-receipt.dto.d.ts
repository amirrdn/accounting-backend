export interface CreatePurchaseReceiptDto {
    purchaseOrderId: string;
    branchId: number;
    receiptDate: Date;
    notes?: string;
    items: CreatePurchaseReceiptItemDto[];
}
export interface CreatePurchaseReceiptItemDto {
    productId: number;
    quantity: number;
    unitPrice: number;
}
//# sourceMappingURL=purchase-receipt.dto.d.ts.map