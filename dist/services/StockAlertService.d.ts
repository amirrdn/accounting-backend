export declare class StockAlertService {
    static getLowStockProducts(): Promise<{
        productId: number;
        productName: string;
        currentStock: number;
        minimumStock: number;
        suggestedQty: number;
    }[]>;
}
//# sourceMappingURL=StockAlertService.d.ts.map