import { AppDataSource } from "../data-source";
import { PaymentReceipt } from "../entity/PaymentReceipt";
import { JournalHelper } from "../utils/JournalHelper";

const repo = AppDataSource.getRepository(PaymentReceipt);

export class PaymentReceiptService {
  static async create(data: Partial<PaymentReceipt>) {
    const payment = repo.create(data);
    await repo.save(payment);

    await JournalHelper.createJournal({
      reference: `RCPT-${payment.paymentNumber}`,
      description: `Pembayaran dari ${payment.customer.name}`,
      entries: [
        {
          accountId: payment.cashAccount.id,
          debit: payment.amount,
          credit: 0,
        },
        {
          accountId: payment.invoice.receivableAccount?.id || 101,
          debit: 0,
          credit: payment.amount,
        },
      ],
    });

    return payment;
  }
}
