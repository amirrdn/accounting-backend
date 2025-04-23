import { PurchaseInvoiceStatus } from "../entity/PurchaseInvoice";
export interface CreatePurchaseInvoiceDto {
    invoiceDate: Date;
    dueDate: Date;
    supplierId: string;
    purchaseOrderId?: string;
    purchaseReceiptId?: string;
    branchId: string;
    payableAccountId: string;
    items: CreatePurchaseInvoiceItemDto[];
    isPpn: boolean;
    isPph: boolean;
    ppnRate?: number;
    pphRate?: number;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    notes?: string;
    attachmentUrl?: string;
}
export interface CreatePurchaseInvoiceItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}
export interface UpdatePurchaseInvoiceDto extends Partial<Omit<CreatePurchaseInvoiceDto, 'items'>> {
    paidAmount?: number;
    status?: PurchaseInvoiceStatus;
    remainingAmount?: number;
}
//# sourceMappingURL=purchase-invoice.dto.d.ts.map