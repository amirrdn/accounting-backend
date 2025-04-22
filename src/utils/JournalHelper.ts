import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/JournalEntry";
import { JournalDetail } from "../entity/JournalDetail";
import { Account } from "../entity/Account";

type JournalEntryInput = {
  reference: string;
  description: string;
  date?: Date;
  branch?: { id: number };
  entries: {
    accountId: number;
    debit: number;
    credit: number;
    description?: string;
  }[];
};

export class JournalHelper {
  private static async generateJournalNumber(): Promise<string> {
    const repo = AppDataSource.getRepository(JournalEntry);
    const lastJournal = await repo.findOne({
      where: {},
      order: { date: 'DESC' }
    });

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    if (!lastJournal) {
      return `J${year}${month}0001`;
    }

    const lastNumber = parseInt(lastJournal.number.slice(-4));
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `J${year}${month}${newNumber}`;
  }

  static async createJournal(data: JournalEntryInput, queryRunner?: any) {
    const entryRepo = queryRunner ? queryRunner.manager.getRepository(JournalEntry) : AppDataSource.getRepository(JournalEntry);
    const detailRepo = queryRunner ? queryRunner.manager.getRepository(JournalDetail) : AppDataSource.getRepository(JournalDetail);
    const accountRepo = queryRunner ? queryRunner.manager.getRepository(Account) : AppDataSource.getRepository(Account);

    const totalDebit = data.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const totalCredit = data.entries.reduce((sum, e) => sum + (e.credit || 0), 0);

    if (totalDebit !== totalCredit) {
      throw new Error("Journal not balanced: total debit and credit must match.");
    }

    const journal = new JournalEntry();
    journal.number = await this.generateJournalNumber();
    journal.reference = data.reference;
    journal.description = data.description;
    journal.date = data.date || new Date();
    journal.details = [];
    if (data.branch) {
      journal.branch = data.branch as any;
    }

    for (const e of data.entries) {
      const account = await accountRepo.findOneByOrFail({ id: e.accountId });

      const detail = new JournalDetail();
      detail.account = account;
      detail.debit = e.debit || 0;
      detail.credit = e.credit || 0;
      detail.description = e.description || "";
      journal.details.push(detail);
    }

    return entryRepo.save(journal);
  }
}
