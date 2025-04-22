import { AppDataSource } from "../data-source";
import { JournalDetail } from "../entity/JournalDetail";
import { Between } from "typeorm";

export class GeneralLedgerService {
  
  static async getLedger(accountId: number, start: Date, end: Date) {
    const repo = AppDataSource.getRepository(JournalDetail);
    const entries = await repo.find({
      where: {
        account: { id: accountId },
        journal: {
          date: Between(start, end),
        },
      },
      relations: ["journal", "account"],
      order: { journal: { date: "ASC" } },
    });

    let saldo = 0;
    const result = entries.map((e) => {
      saldo += e.debit - e.credit;
      return {
        date: e.journal.date,
        description: e.journal.description,
        debit: e.debit,
        credit: e.credit,
        saldo,
      };
    });

    return result;
  }
}
