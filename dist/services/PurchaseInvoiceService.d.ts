import { PurchaseInvoice, PurchaseInvoiceStatus } from "../entity/PurchaseInvoice";
import { CreatePurchaseInvoiceDto, UpdatePurchaseInvoiceDto } from "../types/purchase-invoice.dto";
export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class PurchaseInvoiceService {
    private purchaseInvoiceRepository;
    private purchaseInvoiceItemRepository;
    private productRepository;
    private supplierRepository;
    private branchRepository;
    private accountRepository;
    private uploadDir;
    constructor();
    private generateInvoiceNumber;
    private saveFile;
    getAll(): Promise<PurchaseInvoice[]>;
    getById(id: number): Promise<PurchaseInvoice | null>;
    create(dto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoice>;
    update(id: number, data: UpdatePurchaseInvoiceDto): Promise<PurchaseInvoice | null>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    createPurchaseInvoice(data: any, file?: UploadedFile): Promise<PurchaseInvoice>;
    updatePurchaseInvoice(id: number, data: any, file?: UploadedFile): Promise<PurchaseInvoice>;
    getPurchaseInvoices(): Promise<PurchaseInvoice[]>;
    getPurchaseInvoiceById(id: number): Promise<PurchaseInvoice>;
    updatePurchaseInvoiceStatus(id: number, status: PurchaseInvoiceStatus): Promise<PurchaseInvoice>;
    deletePurchaseInvoice(id: number): Promise<PurchaseInvoice>;
}
//# sourceMappingURL=PurchaseInvoiceService.d.ts.map