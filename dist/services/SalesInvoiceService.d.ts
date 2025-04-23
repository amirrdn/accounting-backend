import { SalesInvoice } from "../entity/SalesInvoice";
export declare class SalesInvoiceService {
    private static generateInvoiceNumber;
    static getAll(): Promise<SalesInvoice[]>;
    static getById(id: number): Promise<SalesInvoice | null>;
    static create(data: any): Promise<SalesInvoice | null>;
    static update(id: number, data: any): Promise<SalesInvoice | null>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=SalesInvoiceService.d.ts.map