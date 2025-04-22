import { Repository } from "typeorm";
import { PurchaseRequest, PurchaseRequestStatus } from "../entity/PurchaseRequest";
import { PurchaseRequestItem } from "../entity/PurchaseRequestItem";
import { AppDataSource } from "../data-source";
import { CreatePurchaseRequestDto, UpdatePurchaseRequestDto } from "../types/purchase-request.dto";
import { User } from "../entity/User";
import { Branch } from "../entity/Branch";
import { Product } from "../entity/Product";
import { ProductStock } from "../entity/ProductStock";

export class PurchaseRequestService {
  private repository: Repository<PurchaseRequest>;
  private purchaseRequestItemRepository: Repository<PurchaseRequestItem>;
  private userRepository: Repository<User>;
  private branchRepository: Repository<Branch>;
  private productRepository: Repository<Product>;
  private productStockRepository: Repository<ProductStock>;

  constructor() {
    this.repository = AppDataSource.getRepository(PurchaseRequest);
    this.purchaseRequestItemRepository = AppDataSource.getRepository(PurchaseRequestItem);
    this.userRepository = AppDataSource.getRepository(User);
    this.branchRepository = AppDataSource.getRepository(Branch);
    this.productRepository = AppDataSource.getRepository(Product);
    this.productStockRepository = AppDataSource.getRepository(ProductStock);
  }

  async findAll() {
    return await this.repository.find({
      relations: ['requestedBy', 'approvedBy', 'rejectedBy', 'items.product.productStocks', 'branch'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string) {
    const request = await this.repository.findOne({
      where: { id },
      relations: ['requestedBy', 'approvedBy', 'rejectedBy', 'items.product', 'branch']
    });

    if (!request) {
      throw new Error('Purchase request not found');
    }

    return request;
  }

  private async generateRequestNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    const lastRequest = await this.repository
      .createQueryBuilder('pr')
      .where('pr.requestNumber LIKE :prefix', { prefix: `PR-${year}${month}%` })
      .orderBy('pr.requestNumber', 'DESC')
      .getOne();
    
    let sequence = 1;
    if (lastRequest) {
      const lastSequence = parseInt(lastRequest.requestNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    return `PR-${year}${month}${String(sequence).padStart(3, '0')}`;
  }

  async create(data: CreatePurchaseRequestDto, user: User) {
    const requestNumber = await this.generateRequestNumber();
    const items = data.items.map((item) => ({
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
      product: { id: item.productId }, 
    }));
  
    const request = this.repository.create({
      requestNumber,
      status: PurchaseRequestStatus.PENDING,
      requestedBy: user,
      requestDate: new Date(),
      branch: { id: data.branchId },
      department: data.department,
      notes: data.notes,
      items: items,
    });

    return await this.repository.save(request);
  }

  async update(id: string, data: UpdatePurchaseRequestDto) {
    const request = await this.findOne(id);
    const previousStatus = request.status;

    if (data.status === PurchaseRequestStatus.PENDING) {
      if (!request.items || request.items.length === 0) {
        throw new Error('Purchase request must have at least one item');
      }
    }

    if (data.status === PurchaseRequestStatus.APPROVED) {
      if (!data.budgetCheck || !data.stockCheck || !data.supplierCheck) {
        throw new Error('All checks must be completed before approval');
      }

      if (previousStatus !== PurchaseRequestStatus.APPROVED) {
        if (!data.products) {
          throw new Error('Products are required when approving a purchase request.');
        }

        for (const item of data.products) {
          if (!item.id) {
            throw new Error(`Product ID not found for item in purchase request ${request.requestNumber}`);
          }

          const product2 = await this.productRepository.findOne({
            where: { id: item.id },
            relations: ['productStocks']
          });

          if (!product2) {
            throw new Error(`Product with ID ${item.id} not found.`);
          }

         
          const productStock = await this.productStockRepository.findOne({
            where: {
              product: { id: item.productId },
              warehouse: { id: data.warehouseId }
            }
          });

          if (!productStock) {
            throw new Error(`Product stock not found for product ID ${item.productId} in warehouse ID ${data.warehouseId}.`);
          }

          const currentQty = parseFloat(productStock.quantity.toString());
          const addedQty = parseFloat(item.quantity.toString());

          const totalQty = currentQty + addedQty;
          productStock.quantity = parseFloat(totalQty.toFixed(2));
          

          if (productStock.quantity < 0) {
            throw new Error('Insufficient stock quantity.');
          }

          await this.productStockRepository.save(productStock);

        }
      }
    }

    if (data.status === PurchaseRequestStatus.REJECTED) {
      if (!data.rejectionReason) {
        throw new Error('Rejection reason is required');
      }
    }

    if (data.branchId) {
      const branch = await this.branchRepository.findOneByOrFail({ id: data.branchId });
      request.branch = branch;
    }

    Object.assign(request, data);
    return await this.repository.save(request);
  }

  async delete(id: string) {
    const request = await this.findOne(id);
    await this.purchaseRequestItemRepository.delete({ purchaseRequest: { id } });
    await this.repository.remove(request);
  }

  async findUserById(id: number) {
    return await this.userRepository.findOneByOrFail({ id });
  }
} 