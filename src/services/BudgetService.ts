import { AppDataSource } from "../data-source";
import { Budget } from "../entity/Budget";
import { BudgetDetail } from "../entity/BudgetDetail";
import { Account } from "../entity/Account";

export class BudgetService {
    private budgetRepository = AppDataSource.getRepository(Budget);
    private budgetDetailRepository = AppDataSource.getRepository(BudgetDetail);
    private accountRepository = AppDataSource.getRepository(Account);

    async getAllBudgets() {
        return await this.budgetRepository.find({
            relations: ['details', 'details.account']
        });
    }

    async getBudgetById(id: number) {
        return await this.budgetRepository.findOne({
            where: { id },
            relations: ['details', 'details.account']
        });
    }

    async deleteBudget(id: number) {
        const budget = await this.budgetRepository.findOne({
            where: { id },
            relations: ['details']
        });
        
        if (!budget) {
            throw new Error('Budget not found');
        }

        if (budget.details) {
            await this.budgetDetailRepository.remove(budget.details);
        }

        await this.budgetRepository.remove(budget);
    }

    async createBudget(data: {
        name: string;
        year: number;
        description: string;
        details: Array<{
            accountId: number;
            monthlyAmounts: number[];
        }>;
    }) {
        const budget = new Budget();
        budget.name = data.name;
        budget.year = data.year;
        budget.description = data.description;
        budget.isActive = true;

        const savedBudget = await this.budgetRepository.save(budget);

        for (const detail of data.details) {
            const account = await this.accountRepository.findOne({ where: { id: detail.accountId } });
            if (!account) continue;

            const budgetDetail = new BudgetDetail();
            budgetDetail.budget = savedBudget;
            budgetDetail.account = account;
            
            budgetDetail.januaryAmount = detail.monthlyAmounts[0] || 0;
            budgetDetail.februaryAmount = detail.monthlyAmounts[1] || 0;
            budgetDetail.marchAmount = detail.monthlyAmounts[2] || 0;
            budgetDetail.aprilAmount = detail.monthlyAmounts[3] || 0;
            budgetDetail.mayAmount = detail.monthlyAmounts[4] || 0;
            budgetDetail.juneAmount = detail.monthlyAmounts[5] || 0;
            budgetDetail.julyAmount = detail.monthlyAmounts[6] || 0;
            budgetDetail.augustAmount = detail.monthlyAmounts[7] || 0;
            budgetDetail.septemberAmount = detail.monthlyAmounts[8] || 0;
            budgetDetail.octoberAmount = detail.monthlyAmounts[9] || 0;
            budgetDetail.novemberAmount = detail.monthlyAmounts[10] || 0;
            budgetDetail.decemberAmount = detail.monthlyAmounts[11] || 0;

            budgetDetail.totalAmount = detail.monthlyAmounts.reduce((a, b) => a + b, 0);
            
            await this.budgetDetailRepository.save(budgetDetail);
        }

        return savedBudget;
    }

    async getBudgetReport(year: number) {
        const budget = await this.budgetRepository.findOne({
            where: { year },
            relations: ['details', 'details.account']
        });

        if (!budget) {
            throw new Error('Budget not found');
        }

        return budget;
    }

    async createBudgetDetail(budgetId: number, data: {
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
    }) {
        const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
        if (!budget) {
            throw new Error('Budget not found');
        }

        const account = await this.accountRepository.findOne({ where: { id: data.accountId } });
        if (!account) {
            throw new Error('Account not found');
        }

        const budgetDetail = new BudgetDetail();
        budgetDetail.budget = budget;
        budgetDetail.account = account;
        
        budgetDetail.januaryAmount = data.januaryAmount || 0;
        budgetDetail.februaryAmount = data.februaryAmount || 0;
        budgetDetail.marchAmount = data.marchAmount || 0;
        budgetDetail.aprilAmount = data.aprilAmount || 0;
        budgetDetail.mayAmount = data.mayAmount || 0;
        budgetDetail.juneAmount = data.juneAmount || 0;
        budgetDetail.julyAmount = data.julyAmount || 0;
        budgetDetail.augustAmount = data.augustAmount || 0;
        budgetDetail.septemberAmount = data.septemberAmount || 0;
        budgetDetail.octoberAmount = data.octoberAmount || 0;
        budgetDetail.novemberAmount = data.novemberAmount || 0;
        budgetDetail.decemberAmount = data.decemberAmount || 0;

        budgetDetail.totalAmount = [
            budgetDetail.januaryAmount,
            budgetDetail.februaryAmount,
            budgetDetail.marchAmount,
            budgetDetail.aprilAmount,
            budgetDetail.mayAmount,
            budgetDetail.juneAmount,
            budgetDetail.julyAmount,
            budgetDetail.augustAmount,
            budgetDetail.septemberAmount,
            budgetDetail.octoberAmount,
            budgetDetail.novemberAmount,
            budgetDetail.decemberAmount
        ].reduce((a, b) => a + b, 0);
        
        return await this.budgetDetailRepository.save(budgetDetail);
    }

    async deleteBudgetDetail(budgetId: number, detailId: number) {
        const budgetDetail = await this.budgetDetailRepository.findOne({
            where: { id: detailId, budget: { id: budgetId } }
        });

        if (!budgetDetail) {
            throw new Error('Budget detail not found');
        }

        await this.budgetDetailRepository.remove(budgetDetail);
    }

    async checkBudgetLimit(accountId: number, amount: number, month: number, year: number): Promise<boolean> {
        const budget = await this.budgetRepository.findOne({
            where: { year, isActive: true },
            relations: ['details', 'details.account']
        });

        if (!budget) return true;

        const budgetDetail = budget.details.find(d => d.account.id === accountId);
        if (!budgetDetail) return true;
        
        const monthlyBudgets = [
            budgetDetail.januaryAmount,
            budgetDetail.februaryAmount,
            budgetDetail.marchAmount,
            budgetDetail.aprilAmount,
            budgetDetail.mayAmount,
            budgetDetail.juneAmount,
            budgetDetail.julyAmount,
            budgetDetail.augustAmount,
            budgetDetail.septemberAmount,
            budgetDetail.octoberAmount,
            budgetDetail.novemberAmount,
            budgetDetail.decemberAmount
        ];

        const monthlyBudget = monthlyBudgets[month - 1];
        
        const actualAmount = budgetDetail.actualAmount || 0;

        return (actualAmount + amount) <= monthlyBudget;
    }
} 