import { Customer } from "../entity/Customer";
export declare class CustomerService {
    static getAll(): Promise<Customer[]>;
    static getById(id: number): Promise<Customer | null>;
    static create(data: Partial<Customer>): Promise<Customer>;
    static update(id: number, data: Partial<Customer>): Promise<Customer | null>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=CustomerService.d.ts.map