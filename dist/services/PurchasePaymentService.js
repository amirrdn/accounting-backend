"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasePaymentService = void 0;
const data_source_1 = require("../data-source");
const PurchasePayment_1 = require("../entity/PurchasePayment");
const PurchaseInvoice_1 = require("../entity/PurchaseInvoice");
const Account_1 = require("../entity/Account");
const typeorm_1 = require("typeorm");
const generateNumber_1 = require("../utils/generateNumber");
class PurchasePaymentService {
    constructor() {
        this.paymentRepository = data_source_1.AppDataSource.getRepository(PurchasePayment_1.PurchasePayment);
        this.invoiceRepository = data_source_1.AppDataSource.getRepository(PurchaseInvoice_1.PurchaseInvoice);
        this.accountRepository = data_source_1.AppDataSource.getRepository(Account_1.Account);
    }
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search, startDate, endDate } = params;
            const skip = (page - 1) * limit;
            const whereClause = {};
            if (search) {
                whereClause.paymentNumber = (0, typeorm_1.Like)(`%${search}%`);
            }
            if (startDate && endDate) {
                whereClause.paymentDate = (0, typeorm_1.Between)(startDate, endDate);
            }
            const [data, total] = yield this.paymentRepository.findAndCount({
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
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentRepository.findOne({
                where: { id },
                relations: {
                    purchaseInvoice: {
                        supplier: true
                    },
                    paymentAccount: true
                }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.paymentNumber) {
                    data.paymentNumber = yield (0, generateNumber_1.generatePaymentNumber)("PAY");
                }
                const invoices = yield this.invoiceRepository.findOne({
                    where: { id: data.purchaseInvoiceId },
                });
                if (!invoices) {
                    throw new Error(`Invoice dengan ID ${data.purchaseInvoiceId} tidak ditemukan`);
                }
                const paymentAccount = yield this.accountRepository.findOne({
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
                const savedPayment = yield this.paymentRepository.save(payment);
                const totalPaid = Number(invoices.paidAmount) + Number(data.amount);
                const remaining = Number(invoices.totalAmount) - totalPaid;
                invoices.paidAmount = totalPaid;
                invoices.remainingAmount = remaining;
                invoices.status = remaining <= 0 ? PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_FULL :
                    remaining < Number(invoices.totalAmount) ? PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_PARTIAL :
                        PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID;
                yield this.invoiceRepository.save(invoices);
                return savedPayment;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentRepository.findOne({
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
                invoice.status = newRemainingAmount === 0 ? PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_FULL :
                    newRemainingAmount < Number(invoice.totalAmount) ? PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_PARTIAL :
                        PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID;
                yield this.invoiceRepository.save(invoice);
            }
            Object.assign(payment, data);
            if (data.paymentAccountId) {
                const paymentAccount = yield this.accountRepository.findOne({
                    where: { id: data.paymentAccountId }
                });
                if (!paymentAccount) {
                    throw new Error("Akun pembayaran tidak ditemukan");
                }
                payment.paymentAccount = paymentAccount;
            }
            return yield this.paymentRepository.save(payment);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentRepository.findOne({
                where: { id },
                relations: { purchaseInvoice: true }
            });
            if (!payment) {
                throw new Error("Pembayaran tidak ditemukan");
            }
            const invoice = payment.purchaseInvoice;
            invoice.paidAmount -= payment.amount;
            invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;
            invoice.status = invoice.remainingAmount === 0 ? PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_FULL :
                invoice.remainingAmount < invoice.totalAmount ? PurchaseInvoice_1.PurchaseInvoiceStatus.PAID_PARTIAL :
                    PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID;
            yield this.invoiceRepository.save(invoice);
            return yield this.paymentRepository.remove(payment);
        });
    }
    getUnpaidInvoices(supplierId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.invoiceRepository.find({
                where: {
                    supplier: { id: supplierId },
                    status: PurchaseInvoice_1.PurchaseInvoiceStatus.UNPAID
                },
                relations: { supplier: true }
            });
        });
    }
    generatePaymentNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, generateNumber_1.generatePaymentNumber)("PAY");
        });
    }
}
exports.PurchasePaymentService = PurchasePaymentService;
