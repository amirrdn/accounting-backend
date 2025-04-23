import { PurchaseRequest } from "../entity/PurchaseRequest";
import { CreatePurchaseRequestDto, UpdatePurchaseRequestDto } from "../types/purchase-request.dto";
import { User } from "../entity/User";
export declare class PurchaseRequestService {
    private repository;
    private purchaseRequestItemRepository;
    private userRepository;
    private branchRepository;
    private productRepository;
    private productStockRepository;
    constructor();
    findAll(): Promise<PurchaseRequest[]>;
    findOne(id: string): Promise<PurchaseRequest>;
    private generateRequestNumber;
    create(data: CreatePurchaseRequestDto, user: User): Promise<PurchaseRequest>;
    update(id: string, data: UpdatePurchaseRequestDto): Promise<PurchaseRequest>;
    delete(id: string): Promise<void>;
    findUserById(id: number): Promise<User>;
}
//# sourceMappingURL=PurchaseRequestService.d.ts.map