import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";

const customerRepo = AppDataSource.getRepository(Customer);

export class CustomerService {
  static getAll() {
    return customerRepo.find();
  }

  static getById(id: number) {
    return customerRepo.findOneBy({ id });
  }

  static create(data: Partial<Customer>) {
    const customer = customerRepo.create(data);
    return customerRepo.save(customer);
  }

  static async update(id: number, data: Partial<Customer>) {
    await customerRepo.update(id, data);
    return customerRepo.findOneBy({ id });
  }

  static delete(id: number) {
    return customerRepo.delete(id);
  }
}
