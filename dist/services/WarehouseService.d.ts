import { Warehouse } from "../entity/Warehouse";
export declare class WarehouseService {
    private warehouseRepository;
    findAll(): Promise<Warehouse[]>;
    findById(id: number): Promise<Warehouse | null>;
    create(warehouseData: Partial<Warehouse>): Promise<Warehouse>;
    update(id: number, warehouseData: Partial<Warehouse>): Promise<Warehouse | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=WarehouseService.d.ts.map