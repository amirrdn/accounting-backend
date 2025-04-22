import { AppDataSource } from "../data-source";
import { PaymentExpense } from "../entity/PaymentExpense";
import { JournalHelper } from "../utils/JournalHelper";

const repo = AppDataSource.getRepository(PaymentExpense);

export class PaymentExpenseService {
  static async create(data: Partial<PaymentExpense>) {
    const payment = repo.create(data);
    await repo.save(payment);

    await JournalHelper.createJournal({
      reference: `PAY-${payment.paymentNumber}`,
      description: `Pembayaran ke ${payment.supplier.name}`,
      entries: [
        {
          accountId: payment.invoice.payableAccount?.id || 201,
          debit: payment.amount,
          credit: 0,
        },
        {
          accountId: payment.cashAccount.id,
          debit: 0,
          credit: payment.amount,
        },
      ],
    });

    return payment;
  }
}
