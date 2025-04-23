import { Product } from "./Product";
/**
 * Entity StockMutation digunakan untuk mencatat pergerakan stok produk
 * baik itu penambahan (IN) maupun pengurangan (OUT)
 */
export declare class StockMutation {
    id: number;
    product: Product;
    reference: string;
    type: "IN" | "OUT";
    quantity: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=StockMutation.d.ts.map