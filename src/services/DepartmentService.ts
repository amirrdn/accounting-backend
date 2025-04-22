import { Department } from "../entity/Department";
import { AppDataSource } from "../data-source";

export class DepartmentService {
  private departmentRepository = AppDataSource.getRepository(Department);

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  async findById(id: number): Promise<Department | null> {
    return this.departmentRepository.findOneBy({ id });
  }

  async create(departmentData: Partial<Department>): Promise<Department> {
    const department = this.departmentRepository.create(departmentData);
    return this.departmentRepository.save(department);
  }

  async update(id: number, departmentData: Partial<Department>): Promise<Department | null> {
    await this.departmentRepository.update(id, departmentData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.departmentRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 