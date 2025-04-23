import { Warehouse } from "./Warehouse";
import { StockTransferItem } from "./StockTransferItem";
export declare enum StockTransferStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    RECEIVED = "RECEIVED"
}
export declare class StockTransfer {
    id: number;
    transferDate: Date;
    fromWarehouse: Warehouse;
    toWarehouse: Warehouse;
    status: string;
    items: StockTransferItem[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=StockTransfer.d.ts.map