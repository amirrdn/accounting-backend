import { Product } from "../entity/Product";
interface ProductCreateInput extends Partial<Product> {
    initial_stocks?: {
        warehouse_id: number;
        quantity: number;
    }[];
}
export declare class ProductService {
    static getAll(page?: number, limit?: number): Promise<{
        data: Product[];
        meta?: undefined;
    } | {
        data: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    static getById(id: number): Promise<Product | null>;
    static validateProduct(data: ProductCreateInput, isUpdate?: boolean): Promise<void>;
    static create(data: ProductCreateInput): Promise<Product | null>;
    static update(id: number, data: ProductCreateInput): Promise<Product | null>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
}
export {};
//# sourceMappingURL=ProductService.d.ts.map