import { Product } from "./Product";
import { User } from "./User";
export declare class StockAdjustment {
    id: number;
    product: Product;
    actualStock: number;
    systemStock: number;
    difference: number;
    reason: string;
    status: 'DRAFT' | 'APPROVED' | 'REJECTED';
    adjustedBy: User;
    adjustedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=StockAdjustment.d.ts.map