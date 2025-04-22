import { AppDataSource } from "../data-source";
import { JournalDetail } from "../entity/JournalDetail";
import { Account } from "../entity/Account";
import { Between, In } from "typeorm";

export class IncomeStatementService {
  static async getProfitLoss(start: Date, end: Date) {
    const detailRepo = AppDataSource.getRepository(JournalDetail);
    const accountRepo = AppDataSource.getRepository(Account);

    const accounts = await accountRepo.find({
      where: { type: In(["revenue", "expense"]) },
    });

    const summary: Record<string, number> = {};
    let totalRevenue = 0;
    let totalExpense = 0;

    for (const acc of accounts) {
      const entries = await detailRepo.find({
        where: {
          account: { id: acc.id },
          journal: { date: Between(start, end) },
        },
        relations: ["journal"],
      });

      const total = entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
      summary[acc.name] = total;

      if (acc.type === "revenue") totalRevenue += total * -1;
      if (acc.type === "expense") totalExpense += total;
    }

    return {
      summary,
      totalRevenue,
      totalExpense,
      netIncome: totalRevenue - totalExpense,
    };
  }
}
