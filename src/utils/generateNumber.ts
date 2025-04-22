import { AppDataSource } from "../data-source";
import { PurchasePayment } from "../entity/PurchasePayment";

export async function generatePaymentNumber(prefix: string): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const repository = AppDataSource.getRepository(PurchasePayment);
  const lastPayment = await repository
    .createQueryBuilder("payment")
    .where("payment.paymentNumber LIKE :prefix", { prefix: `${prefix}${year}${month}%` })
    .orderBy("payment.paymentNumber", "DESC")
    .getOne();

  const currentNumber = lastPayment 
    ? parseInt(lastPayment.paymentNumber.slice(-4)) + 1 
    : 1;

  return `${prefix}${year}${month}${currentNumber.toString().padStart(4, '0')}`;
} 