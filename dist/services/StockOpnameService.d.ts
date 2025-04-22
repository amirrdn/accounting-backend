import { StockOpname } from "../entity/StockOpname";
export declare class StockOpnameService {
    static createStockOpname(warehouseId: number, items: {
        productId: number;
        actualQty: number;
    }[]): Promise<StockOpname>;
}
//# sourceMappingURL=StockOpnameService.d.ts.map