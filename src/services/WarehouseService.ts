import { Warehouse } from "../entity/Warehouse";
import { AppDataSource } from "../data-source";

export class WarehouseService {
  private warehouseRepository = AppDataSource.getRepository(Warehouse);

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find();
  }

  async findById(id: number): Promise<Warehouse | null> {
    return this.warehouseRepository.findOneBy({ id });
  }

  async create(warehouseData: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create(warehouseData);
    return this.warehouseRepository.save(warehouse);
  }

  async update(id: number, warehouseData: Partial<Warehouse>): Promise<Warehouse | null> {
    await this.warehouseRepository.update(id, warehouseData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.warehouseRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 