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
exports.SalesInvoiceService = void 0;
const data_source_1 = require("../data-source");
const SalesInvoice_1 = require("../entity/SalesInvoice");
const SalesInvoiceItem_1 = require("../entity/SalesInvoiceItem");
const Product_1 = require("../entity/Product");
const Customer_1 = require("../entity/Customer");
const Branch_1 = require("../entity/Branch");
const repo = data_source_1.AppDataSource.getRepository(SalesInvoice_1.SalesInvoice);
const itemRepo = data_source_1.AppDataSource.getRepository(SalesInvoiceItem_1.SalesInvoiceItem);
const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
class SalesInvoiceService {
    static generateInvoiceNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const year = today.getFullYear().toString();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const lastInvoice = yield repo.createQueryBuilder("invoice")
                .where("invoice.invoice_number LIKE :prefix", {
                prefix: `INV/${year}${month}/%`
            })
                .orderBy("invoice.invoice_number", "DESC")
                .getOne();
            let sequence = 1;
            if (lastInvoice) {
                const lastSequence = parseInt(lastInvoice.invoice_number.split('/').pop() || '0');
                sequence = lastSequence + 1;
            }
            return `INV/${year}${month}/${sequence.toString().padStart(4, '0')}`;
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return repo.find();
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return repo.findOne({
                where: { id },
                relations: ['branch']
            });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                if (!data.items || !Array.isArray(data.items)) {
                    throw new Error('Items are required and must be an array');
                }
                if (!data.customer) {
                    throw new Error('Customer is required');
                }
                const customerId = parseInt(data.customer.id);
                if (isNaN(customerId)) {
                    throw new Error('Invalid customer ID format');
                }
                const customer = yield data_source_1.AppDataSource.getRepository(Customer_1.Customer).findOneBy({ id: customerId });
                if (!customer) {
                    throw new Error('Customer not found');
                }
                let branchId = 1;
                if (data.branch) {
                    branchId = parseInt(data.branch.id);
                    if (isNaN(branchId)) {
                        throw new Error('Invalid branch ID format');
                    }
                }
                for (const item of data.items) {
                    if (!item.product.id) {
                        throw new Error('Each item must have a productId');
                    }
                    const productId = parseInt(item.product.id);
                    if (isNaN(productId)) {
                        throw new Error(`Invalid productId format: ${item.product.id}`);
                    }
                    const product = yield productRepo.findOneBy({ id: productId });
                    if (!product) {
                        throw new Error(`Product with id ${productId} not found`);
                    }
                }
                const invoice_number = yield this.generateInvoiceNumber();
                const invoice = queryRunner.manager.create(SalesInvoice_1.SalesInvoice, {
                    invoice_number,
                    customer: { id: customerId },
                    receivableAccount: data.receivableAccount,
                    total: 0,
                    branch: { id: branchId },
                    notes: data.notes,
                    items: data.items.map((item) => {
                        const quantity = parseFloat(item.quantity.toString());
                        const price = parseFloat(item.price.toString());
                        const subtotal = parseFloat(item.total.toString());
                        return {
                            product: { id: item.product.id },
                            quantity,
                            price,
                            total: subtotal
                        };
                    })
                });
                const savedInvoice = yield queryRunner.manager.save(invoice);
                savedInvoice.total = savedInvoice.items.reduce((sum, item) => sum + item.total, 0);
                yield queryRunner.manager.save(savedInvoice);
                yield queryRunner.commitTransaction();
                return repo.findOne({
                    where: { id: savedInvoice.id },
                    relations: ['items', 'items.product', 'customer', 'branch', 'receivableAccount']
                });
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const invoice = yield queryRunner.manager.findOne(SalesInvoice_1.SalesInvoice, {
                    where: { id },
                    relations: ['items', 'customer', 'branch']
                });
                if (!invoice) {
                    throw new Error('Invoice not found');
                }
                const customer = yield queryRunner.manager.findOne(Customer_1.Customer, { where: { id: data.customer.id } });
                const branch = yield queryRunner.manager.findOne(Branch_1.Branch, { where: { id: data.branch.id } });
                if (!customer || !branch) {
                    throw new Error('Customer or branch not found');
                }
                yield queryRunner.manager.update(SalesInvoice_1.SalesInvoice, id, {
                    customer: customer,
                    branch: branch,
                    notes: data.notes || invoice.notes
                });
                if ((_a = invoice.items) === null || _a === void 0 ? void 0 : _a.length) {
                    yield queryRunner.manager.delete(SalesInvoiceItem_1.SalesInvoiceItem, invoice.items.map(item => item.id));
                }
                for (const item of data.items) {
                    if (!item.quantity || !item.price || !item.total) {
                        throw new Error('Each item must have quantity, price, and total');
                    }
                    const quantity = parseFloat(item.quantity.toString());
                    const price = parseFloat(item.price.toString());
                    const total = parseFloat(item.total.toString());
                    if (isNaN(quantity) || isNaN(price) || isNaN(total)) {
                        throw new Error('Invalid number format for quantity, price, or total');
                    }
                    const product = yield queryRunner.manager.findOne(Product_1.Product, { where: { id: item.product.id } });
                    if (!product) {
                        throw new Error(`Product with id ${item.product.id} not found`);
                    }
                    yield queryRunner.manager.query(`INSERT INTO sales_invoice_item (salesInvoiceId, productId, quantity, price, total) VALUES (?, ?, ?, ?, ?)`, [id, item.product.id, quantity, price, total]);
                }
                const total = data.items.reduce((sum, item) => sum + parseFloat(item.total.toString()), 0);
                yield queryRunner.manager.update(SalesInvoice_1.SalesInvoice, id, { total });
                yield queryRunner.commitTransaction();
                const result = yield queryRunner.manager.findOne(SalesInvoice_1.SalesInvoice, {
                    where: { id },
                    relations: {
                        items: {
                            product: true
                        },
                        customer: true,
                        branch: true,
                        receivableAccount: true
                    }
                });
                yield queryRunner.release();
                return result;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield repo.findOne({
                where: { id },
                relations: ['items']
            });
            if (!invoice) {
                throw new Error('Invoice not found');
            }
            if (invoice.items && invoice.items.length > 0) {
                yield itemRepo.delete(invoice.items.map(item => item.id));
            }
            return repo.delete(id);
        });
    }
}
exports.SalesInvoiceService = SalesInvoiceService;
