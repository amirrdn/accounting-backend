import { Department } from "../entity/Department";
export declare class DepartmentService {
    private departmentRepository;
    findAll(): Promise<Department[]>;
    findById(id: number): Promise<Department | null>;
    create(departmentData: Partial<Department>): Promise<Department>;
    update(id: number, departmentData: Partial<Department>): Promise<Department | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=DepartmentService.d.ts.map