import { AppDataSource } from "../data-source";
import { Supplier } from "../entity/Supplier";

const supplierRepo = AppDataSource.getRepository(Supplier);

export class SupplierService {
  static getAll() {
    return supplierRepo.find();
  }

  static getById(id: number) {
    return supplierRepo.findOneBy({ id });
  }

  static create(data: Partial<Supplier>) {
    const supplier = supplierRepo.create(data);
    return supplierRepo.save(supplier);
  }

  static async update(id: number, data: Partial<Supplier>) {
    await supplierRepo.update(id, data);
    return supplierRepo.findOneBy({ id });
  }

  static delete(id: number) {
    return supplierRepo.delete(id);
  }
}
