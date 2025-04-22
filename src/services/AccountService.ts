import { AppDataSource } from "../data-source";
import { Account } from "../entity/Account";
import { JournalDetail } from "../entity/JournalDetail";
import { CashBankTransaction } from "../entity/CashBankTransaction";
import { PaymentReceipt } from "../entity/PaymentReceipt";
import { PaymentExpense } from "../entity/PaymentExpense";
import { SalesInvoice } from "../entity/SalesInvoice";
import { PurchaseInvoice } from "../entity/PurchaseInvoice";

const accountRepo = AppDataSource.getRepository(Account);
const journalDetailRepo = AppDataSource.getRepository(JournalDetail);
const cashBankTransactionRepo = AppDataSource.getRepository(CashBankTransaction);
const paymentReceiptRepo = AppDataSource.getRepository(PaymentReceipt);
const paymentExpenseRepo = AppDataSource.getRepository(PaymentExpense);
const salesInvoiceRepo = AppDataSource.getRepository(SalesInvoice);
const purchaseInvoiceRepo = AppDataSource.getRepository(PurchaseInvoice);

export class AccountService {
  static getAllNoPaginate() {
    return accountRepo.find({ relations: ["parent"] });
  }

  static getById(id: number) {
    return accountRepo.findOne({ where: { id }, relations: ["parent"] });
  }

  static create(data: Partial<Account>) {
    const account = accountRepo.create(data);
    return accountRepo.save(account);
  }

  static async update(id: number, data: Partial<Account>) {
    await accountRepo.update(id, data);
    return accountRepo.findOne({ where: { id } });
  }

  static delete(id: number) {
    return accountRepo.delete(id);
  }

  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [accounts, total] = await accountRepo.findAndCount({
      relations: {
        parent: true
      },
      skip: skip,
      take: limit,
      order: {
        code: "ASC"
      }
    });

    const accountsWithBalance = await Promise.all(accounts.map(async (account) => {
      const journalDetails = await journalDetailRepo.find({
        where: { account: { id: account.id } }
      });
      const journalBalance = journalDetails.reduce((sum, detail) => {
        const debit = Number(detail.debit) || 0;
        const credit = Number(detail.credit) || 0;
        return Number((Number(sum) + (debit - credit)).toFixed(2));
      }, 0);

      const cashBankTransactions = await cashBankTransactionRepo.find({
        where: [
          { accountId: account.id },
          { destinationAccountId: account.id }
        ]
      });
      const cashBankBalance = cashBankTransactions.reduce((sum, transaction) => {
        let amount = 0;
        if (transaction.accountId === account.id) {
          amount = -Number(transaction.amount) || 0;
        } else if (transaction.destinationAccountId === account.id) {
          amount = Number(transaction.amount) || 0;
        }
        return Number((Number(sum) + amount).toFixed(2));
      }, 0);

      const paymentReceipts = await paymentReceiptRepo.find({
        where: { cashAccount: { id: account.id } }
      }).catch(() => []);
      const paymentReceiptBalance = paymentReceipts.reduce((sum, receipt) => {
        const amount = Number(receipt.amount) || 0;
        return Number((Number(sum) + amount).toFixed(2));
      }, 0);

      const paymentExpenses = await paymentExpenseRepo.find({
        where: { cashAccount: { id: account.id } }
      }).catch(() => []);
      const paymentExpenseBalance = paymentExpenses.reduce((sum, expense) => {
        const amount = Number(expense.amount) || 0;
        return Number((Number(sum) - amount).toFixed(2));
      }, 0);

      const salesInvoices = await salesInvoiceRepo.find({
        where: { receivableAccount: { id: account.id } }
      }).catch(() => []);
      const salesInvoiceBalance = salesInvoices.reduce((sum, invoice) => {
        const total = Number(invoice.total) || 0;
        return Number((Number(sum) + total).toFixed(2));
      }, 0);

      const purchaseInvoices = await purchaseInvoiceRepo.find({
        where: { payableAccount: { id: account.id } }
      }).catch(() => []);
      const purchaseInvoiceBalance = purchaseInvoices.reduce((sum, invoice) => {
        const totalAmount = Number(invoice.totalAmount) || 0;
        return Number((Number(sum) - totalAmount).toFixed(2));
      }, 0);

      const totalBalance = Number((
        Number(journalBalance) + 
        Number(cashBankBalance) + 
        Number(paymentReceiptBalance) + 
        Number(paymentExpenseBalance) + 
        Number(salesInvoiceBalance) + 
        Number(purchaseInvoiceBalance)
      ).toFixed(2));

      return {
        ...account,
        balance: totalBalance
      };
    }));

    return {
      data: accountsWithBalance,
      total: total
    };
  }
}
