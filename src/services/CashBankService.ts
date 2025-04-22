import { Between } from "typeorm";
import { AppDataSource } from "../data-source";
import { CashBankTransaction } from "../entity/CashBankTransaction";
import { JournalHelper } from "../utils/JournalHelper";
import { JournalDetail } from "../entity/JournalDetail";


export class CashBankService {
  static async transfer(sourceId: number, destinationAccountId: number, amount: number, description = "", branchId: number, date?: Date) {
    if (sourceId === destinationAccountId) throw new Error("Akun sumber dan tujuan tidak boleh sama");
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const balance = await this.getAccountBalance(sourceId);
      if (balance < amount) {
        throw new Error("Saldo tidak cukup untuk transfer");
      }

      const txRepo = queryRunner.manager.getRepository(CashBankTransaction);

      const tx = txRepo.create({
        type: "TRANSFER",
        amount,
        description,
        sourceAccount: { id: sourceId } as any,
        destinationAccount: { id: destinationAccountId } as any,
        branch: { id: branchId } as any,
        date: date || new Date()
      });
      await txRepo.save(tx);

      await JournalHelper.createJournal({
        reference: `TRANSFER-${tx.id}`,
        description: `Transfer kas: ${description}`,
        branch: { id: branchId } as any,
        date: date || new Date(),
        entries: [
          { accountId: destinationAccountId, debit: amount, credit: 0 },
          { accountId: sourceId, debit: 0, credit: amount },
        ],
      }, queryRunner);

      await queryRunner.commitTransaction();
      return tx;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async cashIn(accountId: number, amount: number, description = "", branchId: number, destinationAccountId: number, date?: Date) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txRepo = queryRunner.manager.getRepository(CashBankTransaction);

      const tx = txRepo.create({
        type: "IN",
        amount: Number(amount),
        description,
        sourceAccount: { id: accountId } as any,
        destinationAccount: { id: destinationAccountId } as any,
        branch: { id: branchId } as any,
        date: date || new Date()
      });
      
      await txRepo.save(tx);

      await JournalHelper.createJournal({
        reference: `CASH_IN-${tx.id}`,
        description: `Kas Masuk: ${description}`,
        branch: { id: branchId } as any,
        date: date || new Date(),
        entries: [
          { accountId: destinationAccountId, debit: Number(amount), credit: 0 },
          { accountId: accountId, debit: 0, credit: Number(amount) }
        ],
      }, queryRunner);

      await queryRunner.commitTransaction();
      return tx;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async cashOut(accountId: number, amount: number, description = "", branchId: number, destinationAccountId: number, date?: Date) {
    const txRepo = AppDataSource.getRepository(CashBankTransaction);

    const tx = txRepo.create({
      type: "OUT",
      amount: Number(amount),
        description,
        sourceAccount: { id: accountId } as any,
        destinationAccount: { id: destinationAccountId } as any,
        branch: { id: branchId } as any,
        date: date || new Date()
    });
    await txRepo.save(tx);

    await JournalHelper.createJournal({
      reference: `CASH_OUT-${tx.id}`,
      description: `Kas Keluar: ${description}`,
      branch: { id: branchId } as any,
      date: date || new Date(),
      entries: [
        { accountId: destinationAccountId, debit: Number(amount), credit: 0 },
        { accountId: accountId, debit: 0, credit: Number(amount) }
      ],
    });

    return tx;
  }

  static async listTransactions() {
    return await AppDataSource.getRepository(CashBankTransaction).find({
      relations: ["sourceAccount", "destinationAccount", "branch"],
      order: { date: "DESC" }
    });
  }
  static async getCashFlow(start: Date, end: Date) {
    const repo = AppDataSource.getRepository(CashBankTransaction);
    const txs = await repo.find({
      where: {
        date: Between(start, end)
      },
      relations: ["sourceAccount", "destinationAccount", "branch"]
    });
  
    const result = {
      cashIn: 0,
      cashOut: 0,
      transfer: 0,
      details: txs.map(tx => ({
        date: tx.date,
        type: tx.type,
        amount: tx.amount,
        description: tx.description
      }))
    };
  
    for (const tx of txs) {
      if (tx.type === "IN") result.cashIn += Number(tx.amount);
      else if (tx.type === "OUT") result.cashOut += Number(tx.amount);
      else if (tx.type === "TRANSFER") result.transfer += Number(tx.amount);
    }
  
    return result;
  }

  static async approve(id: number) {
    const repo = AppDataSource.getRepository(CashBankTransaction);
    const tx = await repo.findOneByOrFail({ id });
  
    if (tx.isApproved) throw new Error("Sudah disetujui");
    tx.isApproved = true;
    await repo.save(tx);
  
    if (tx.type === "TRANSFER") {
      await JournalHelper.createJournal({
        reference: `TRANSFER_APPROVED-${tx.id}`,
        description: `Transfer Kas APPROVED`,
        entries: [
          { accountId: tx.destinationAccount.id, debit: tx.amount, credit: 0 },
          { accountId: tx.sourceAccount.id, debit: 0, credit: tx.amount }
        ],
      });
    }
  
    return tx;
  }

  static async getAccountBalance(accountId: number) {
    const journalRepo = AppDataSource.getRepository(JournalDetail);
  
    const result = await journalRepo
      .createQueryBuilder("detail")
      .select("SUM(detail.debit)", "totalDebit")
      .addSelect("SUM(detail.credit)", "totalCredit")
      .where("detail.accountId = :accountId", { accountId })
      .getRawOne();
  
    const debit = Number(result?.totalDebit || 0);
    const credit = Number(result?.totalCredit || 0);
  
    return debit - credit;
  }
  
  
}
