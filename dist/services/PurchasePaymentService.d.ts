import { PurchasePayment } from "../entity/PurchasePayment";
import { PurchaseInvoice } from "../entity/PurchaseInvoice";
export declare class PurchasePaymentService {
    private paymentRepository;
    private invoiceRepository;
    private accountRepository;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: PurchasePayment[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findById(id: number): Promise<PurchasePayment | null>;
    create(data: {
        paymentNumber?: string;
        paymentDate: string;
        purchaseInvoiceId: number;
        amount: number;
        paymentAccountId: number;
        notes?: string;
    }): Promise<PurchasePayment>;
    update(id: number, data: {
        paymentDate?: string;
        amount?: number;
        paymentAccountId?: number;
        notes?: string;
    }): Promise<PurchasePayment>;
    delete(id: number): Promise<PurchasePayment>;
    getUnpaidInvoices(supplierId: number): Promise<PurchaseInvoice[]>;
    generatePaymentNumber(): Promise<string>;
}
//# sourceMappingURL=PurchasePaymentService.d.ts.map