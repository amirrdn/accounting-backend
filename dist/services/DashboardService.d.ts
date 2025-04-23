export declare class DashboardService {
    static getStockSummary(): Promise<{
        totalProducts: number;
        totalStockValue: number;
        lowStockItems: {
            id: number;
            name: string;
            qty: number;
        }[];
        stockPerWarehouse: {
            warehouse: string;
            totalQty: number;
        }[];
    }>;
    static getFinanceSummary(): Promise<{
        totalSales: number;
        totalPurchases: number;
        grossProfit: number;
        cashBalance: number;
        accountsReceivable: number;
        accountsPayable: number;
    }>;
}
//# sourceMappingURL=DashboardService.d.ts.map