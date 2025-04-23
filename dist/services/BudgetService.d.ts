import { Budget } from "../entity/Budget";
import { BudgetDetail } from "../entity/BudgetDetail";
export declare class BudgetService {
    private budgetRepository;
    private budgetDetailRepository;
    private accountRepository;
    getAllBudgets(): Promise<Budget[]>;
    getBudgetById(id: number): Promise<Budget | null>;
    deleteBudget(id: number): Promise<void>;
    createBudget(data: {
        name: string;
        year: number;
        description: string;
        details: Array<{
            accountId: number;
            monthlyAmounts: number[];
        }>;
    }): Promise<Budget>;
    getBudgetReport(year: number): Promise<Budget>;
    createBudgetDetail(budgetId: number, data: {
        accountId: number;
        januaryAmount?: number;
        februaryAmount?: number;
        marchAmount?: number;
        aprilAmount?: number;
        mayAmount?: number;
        juneAmount?: number;
        julyAmount?: number;
        augustAmount?: number;
        septemberAmount?: number;
        octoberAmount?: number;
        novemberAmount?: number;
        decemberAmount?: number;
    }): Promise<BudgetDetail>;
    deleteBudgetDetail(budgetId: number, detailId: number): Promise<void>;
    checkBudgetLimit(accountId: number, amount: number, month: number, year: number): Promise<boolean>;
}
//# sourceMappingURL=BudgetService.d.ts.map