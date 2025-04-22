import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/JournalEntry";

const repo = AppDataSource.getRepository(JournalEntry);

export class JournalEntryService {
  static getAll() {
    return repo.find();
  }

  static getById(id: number) {
    return repo.findOneBy({ id });
  }

  static async create(data: Partial<JournalEntry>) {
    const journal = repo.create(data);

    const totalDebit = data.details?.reduce((sum, d) => sum + Number(d.debit || 0), 0) || 0;
    const totalCredit = data.details?.reduce((sum, d) => sum + Number(d.credit || 0), 0) || 0;

    if (totalDebit !== totalCredit) {
      throw new Error("Total debit and credit must be equal");
    }

    return repo.save(journal);
  }

  static async update(id: number, data: Partial<JournalEntry>) {
    await repo.update(id, data);
    return repo.findOneBy({ id });
  }

  static delete(id: number) {
    return repo.delete(id);
  }
}
