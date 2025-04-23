import { Request, Response } from "express";
export declare class WarehouseController {
    private warehouseService;
    getAllWarehouses(req: Request, res: Response): Promise<void>;
    getWarehouseById(req: Request, res: Response): Promise<void>;
    createWarehouse(req: Request, res: Response): Promise<void>;
    updateWarehouse(req: Request, res: Response): Promise<void>;
    deleteWarehouse(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=WarehouseController.d.ts.map