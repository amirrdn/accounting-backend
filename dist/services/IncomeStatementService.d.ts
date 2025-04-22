export declare class IncomeStatementService {
    static getProfitLoss(start: Date, end: Date): Promise<{
        summary: Record<string, number>;
        totalRevenue: number;
        totalExpense: number;
        netIncome: number;
    }>;
}
//# sourceMappingURL=IncomeStatementService.d.ts.map