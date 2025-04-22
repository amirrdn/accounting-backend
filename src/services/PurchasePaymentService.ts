import { AppDataSource } from "../data-source";
import { PurchasePayment } from "../entity/PurchasePayment";
import { PurchaseInvoice, PurchaseInvoiceStatus } from "../entity/PurchaseInvoice";
import { Account } from "../entity/Account";
import { Between, Like } from "typeorm";
import { generatePaymentNumber } from "../utils/generateNumber";

export class PurchasePaymentService {
  private paymentRepository = AppDataSource.getRepository(PurchasePayment);
  private invoiceRepository = AppDataSource.getRepository(PurchaseInvoice);
  private accountRepository = AppDataSource.getRepository(Account);

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, limit = 10, search, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    
    if (search) {
      whereClause.paymentNumber = Like(`%${search}%`);
    }

    if (startDate && endDate) {
      whereClause.paymentDate = Between(startDate, endDate);
    }

    const [data, total] = await this.paymentRepository.findAndCount({
      where: whereClause,
      relations: {
        purchaseInvoice: {
          supplier: true
        },
        paymentAccount: true
      },
      skip,
      take: limit,
      order: {
        paymentDate: "DESC"
      }
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: number) {
    return await this.paymentRepository.findOne({
      where: { id },
      relations: {
        purchaseInvoice: {
          supplier: true
        },
        paymentAccount: true
      }
    });
  }

  async create(data: {
    paymentNumber?: string;
    paymentDate: string;
    purchaseInvoiceId: number;
    amount: number;
    paymentAccountId: number;
    notes?: string;
  }) {
    try {
      if (!data.paymentNumber) {
        data.paymentNumber = await generatePaymentNumber("PAY");
      }
  
      const invoices = await this.invoiceRepository.findOne({
        where: { id: data.purchaseInvoiceId },
      });
  
      if (!invoices) {
        throw new Error(`Invoice dengan ID ${data.purchaseInvoiceId} tidak ditemukan`);
      }
  
      const paymentAccount = await this.accountRepository.findOne({
        where: { id: data.paymentAccountId }
      });
  
      if (!paymentAccount) {
        throw new Error("Akun pembayaran tidak ditemukan");
      }
  
      if (data.amount > invoices.remainingAmount) {
        throw new Error("Jumlah pembayaran melebihi sisa tagihan");
      }

      const payment = this.paymentRepository.create({
        paymentNumber: data.paymentNumber,
        paymentDate: new Date(data.paymentDate),
        amount: data.amount,
        purchaseInvoice: invoices,
        purchaseInvoiceId: invoices.id,
        paymentAccount: paymentAccount,
        paymentAccountId: paymentAccount.id,
        notes: data.notes
      });
  
      const savedPayment = await this.paymentRepository.save(payment);
  
      const totalPaid = Number(invoices.paidAmount) + Number(data.amount);
      const remaining = Number(invoices.totalAmount) - totalPaid;
  
      invoices.paidAmount = totalPaid;
      invoices.remainingAmount = remaining;
      invoices.status = remaining <= 0 ? PurchaseInvoiceStatus.PAID_FULL :
        remaining < Number(invoices.totalAmount) ? PurchaseInvoiceStatus.PAID_PARTIAL :
        PurchaseInvoiceStatus.UNPAID;
  
      await this.invoiceRepository.save(invoices);
  
      return savedPayment;
    } catch (error) {
      throw error;
    }
  }
  

  async update(id: number, data: {
    paymentDate?: string;
    amount?: number;
    paymentAccountId?: number;
    notes?: string;
  }) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: {
        purchaseInvoice: true,
        paymentAccount: true
      }
    });

    if (!payment) {
      throw new Error("Pembayaran tidak ditemukan");
    }

    if (data.amount && data.amount !== payment.amount) {
      const invoice = payment.purchaseInvoice;
      const oldAmount = payment.amount;
      const difference = data.amount - oldAmount;
      
      const newPaidAmount = Number(invoice.paidAmount) + difference;
      const newRemainingAmount = Number(invoice.totalAmount) - newPaidAmount;

      if (newRemainingAmount < 0) {
        throw new Error("Jumlah pembayaran melebihi total tagihan");
      }

      invoice.paidAmount = newPaidAmount;
      invoice.remainingAmount = newRemainingAmount;
      invoice.status = newRemainingAmount === 0 ? PurchaseInvoiceStatus.PAID_FULL : 
                      newRemainingAmount < Number(invoice.totalAmount) ? PurchaseInvoiceStatus.PAID_PARTIAL : 
                      PurchaseInvoiceStatus.UNPAID;

      await this.invoiceRepository.save(invoice);
    }

    Object.assign(payment, data);

    if (data.paymentAccountId) {
      const paymentAccount = await this.accountRepository.findOne({
        where: { id: data.paymentAccountId }
      });

      if (!paymentAccount) {
        throw new Error("Akun pembayaran tidak ditemukan");
      }

      payment.paymentAccount = paymentAccount;
    }

    return await this.paymentRepository.save(payment);
  }

  async delete(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: { purchaseInvoice: true }
    });

    if (!payment) {
      throw new Error("Pembayaran tidak ditemukan");
    }

    const invoice = payment.purchaseInvoice;
    invoice.paidAmount -= payment.amount;
    invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;
    invoice.status = invoice.remainingAmount === 0 ? PurchaseInvoiceStatus.PAID_FULL : 
                    invoice.remainingAmount < invoice.totalAmount ? PurchaseInvoiceStatus.PAID_PARTIAL : 
                    PurchaseInvoiceStatus.UNPAID;

    await this.invoiceRepository.save(invoice);

    return await this.paymentRepository.remove(payment);
  }

  async getUnpaidInvoices(supplierId: number) {
    return await this.invoiceRepository.find({
      where: {
        supplier: { id: supplierId },
        status: PurchaseInvoiceStatus.UNPAID
      },
      relations: { supplier: true }
    });
  }

  async generatePaymentNumber() {
    return await generatePaymentNumber("PAY");
  }
}