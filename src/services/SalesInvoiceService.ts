import { AppDataSource } from "../data-source";
import { SalesInvoice } from "../entity/SalesInvoice";
import { SalesInvoiceItem } from "../entity/SalesInvoiceItem";
import { Product } from "../entity/Product";
import { Customer } from "../entity/Customer";
import { Branch } from "../entity/Branch";

const repo = AppDataSource.getRepository(SalesInvoice);
const itemRepo = AppDataSource.getRepository(SalesInvoiceItem);
const productRepo = AppDataSource.getRepository(Product);

interface SalesInvoiceItemData {
  quantity: number;
  price: string;
  total: string;
  product: {
    id: number;
  };
}

export class SalesInvoiceService {
  private static async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    
    const lastInvoice = await repo.createQueryBuilder("invoice")
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
  }

  static async getAll() {
    return repo.find();
  }

  static async getById(id: number) {
    return repo.findOne({
      where: { id },
      relations: ['branch']
    });
  }

  static async create(data: any) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

      const customer = await AppDataSource.getRepository(Customer).findOneBy({ id: customerId });
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
        
        const product = await productRepo.findOneBy({ id: productId });
        if (!product) {
          throw new Error(`Product with id ${productId} not found`);
        }
      }

      const invoice_number = await this.generateInvoiceNumber();

      const invoice = queryRunner.manager.create(SalesInvoice, {
        invoice_number,
        customer: { id: customerId },
        receivableAccount: data.receivableAccount,
        total: 0,
        branch: { id: branchId },
        notes: data.notes,
        items: data.items.map((item: SalesInvoiceItemData) => {
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
      
      const savedInvoice = await queryRunner.manager.save(invoice);
      
      savedInvoice.total = savedInvoice.items.reduce((sum: number, item: SalesInvoiceItem) => sum + item.total, 0);
      await queryRunner.manager.save(savedInvoice);

      await queryRunner.commitTransaction();
      
      return repo.findOne({
        where: { id: savedInvoice.id },
        relations: ['items', 'items.product', 'customer', 'branch', 'receivableAccount']
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async update(id: number, data: any) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = await queryRunner.manager.findOne(SalesInvoice, {
        where: { id },
        relations: ['items', 'customer', 'branch']
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }
      const customer = await queryRunner.manager.findOne(Customer, { where: { id: data.customer.id } });
      const branch = await queryRunner.manager.findOne(Branch, { where: { id: data.branch.id } });

      if (!customer || !branch) {
        throw new Error('Customer or branch not found');
      }

      await queryRunner.manager.update(SalesInvoice, id, {
        customer: customer,
        branch: branch,
        notes: data.notes || invoice.notes
      });

      if (invoice.items?.length) {
        await queryRunner.manager.delete(SalesInvoiceItem, invoice.items.map(item => item.id));
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

        const product = await queryRunner.manager.findOne(Product, { where: { id: item.product.id } });
        if (!product) {
          throw new Error(`Product with id ${item.product.id} not found`);
        }

        await queryRunner.manager.query(
          `INSERT INTO sales_invoice_item (salesInvoiceId, productId, quantity, price, total) VALUES (?, ?, ?, ?, ?)`,
          [id, item.product.id, quantity, price, total]
        );
      }

      const total = data.items.reduce((sum: number, item: SalesInvoiceItemData) => sum + parseFloat(item.total.toString()), 0);
      await queryRunner.manager.update(SalesInvoice, id, { total });

      await queryRunner.commitTransaction();

      const result = await queryRunner.manager.findOne(SalesInvoice, {
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

      await queryRunner.release();
      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async delete(id: number) {
    const invoice = await repo.findOne({
      where: { id },
      relations: ['items']
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.items && invoice.items.length > 0) {
      await itemRepo.delete(invoice.items.map(item => item.id));
    }

    return repo.delete(id);
  }
}
