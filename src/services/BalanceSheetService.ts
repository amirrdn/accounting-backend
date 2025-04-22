import { AppDataSource } from "../data-source";
import { JournalDetail } from "../entity/JournalDetail";
import { Account } from "../entity/Account";
import { Between, In } from "typeorm";

export class BalanceSheetService {
  static async getBalanceSheet(endDate: Date) {
    const detailRepo = AppDataSource.getRepository(JournalDetail);
    const accountRepo = AppDataSource.getRepository(Account);

    const balanceAccounts = await accountRepo.find({
      where: { type: In(["ASSET", "LIABILITY", "EQUITY"]) },
    });

    const balances: Record<string, number> = {};

    for (const acc of balanceAccounts) {
      const entries = await detailRepo.find({
        where: {
          account: { id: acc.id },
          journal: { date: Between(new Date("1900-01-01"), endDate) },
        },
        relations: ["journal"],
      });

      const total = entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
      balances[acc.name] = total;
    }

    return balances;
  }
}
