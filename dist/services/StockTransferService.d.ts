import { Warehouse } from "../entity/Warehouse";
import { StockTransfer } from "../entity/StockTransfer";
export declare class StockTransferService {
    static createTransfer(data: {
        fromWarehouseId: number;
        toWarehouseId: number;
        transferDate: string;
        items: {
            productId: number;
            quantity: number;
        }[];
    }): Promise<{
        fromWarehouse: Warehouse;
        toWarehouse: Warehouse;
        transferDate: Date;
        status: string;
    } & StockTransfer>;
    static getAllTransfers(): Promise<StockTransfer[]>;
    static markAsReceived(transferId: number): Promise<StockTransfer>;
}
//# sourceMappingURL=StockTransferService.d.ts.map