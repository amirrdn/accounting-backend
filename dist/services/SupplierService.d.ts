import { Supplier } from "../entity/Supplier";
export declare class SupplierService {
    static getAll(): Promise<Supplier[]>;
    static getById(id: number): Promise<Supplier | null>;
    static create(data: Partial<Supplier>): Promise<Supplier>;
    static update(id: number, data: Partial<Supplier>): Promise<Supplier | null>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=SupplierService.d.ts.map