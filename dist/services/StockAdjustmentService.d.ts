import { StockAdjustment } from "../entity/StockAdjustment";
export declare class StockAdjustmentService {
    static adjustStock(productId: number, actualQty: number, userId: number, reason: string): Promise<{
        message: string;
        difference?: undefined;
    } | {
        message: string;
        difference: number;
    }>;
    static getAdjustments(): Promise<StockAdjustment[]>;
    static approveAdjustment(id: number): Promise<StockAdjustment>;
}
//# sourceMappingURL=StockAdjustmentService.d.ts.map