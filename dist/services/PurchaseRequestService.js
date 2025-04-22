"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseRequestService = void 0;
const PurchaseRequest_1 = require("../entity/PurchaseRequest");
const PurchaseRequestItem_1 = require("../entity/PurchaseRequestItem");
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Branch_1 = require("../entity/Branch");
const Product_1 = require("../entity/Product");
const ProductStock_1 = require("../entity/ProductStock");
class PurchaseRequestService {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(PurchaseRequest_1.PurchaseRequest);
        this.purchaseRequestItemRepository = data_source_1.AppDataSource.getRepository(PurchaseRequestItem_1.PurchaseRequestItem);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        this.branchRepository = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
        this.productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        this.productStockRepository = data_source_1.AppDataSource.getRepository(ProductStock_1.ProductStock);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                relations: ['requestedBy', 'approvedBy', 'rejectedBy', 'items.product.productStocks', 'branch'],
                order: {
                    createdAt: 'DESC'
                }
            });
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.repository.findOne({
                where: { id },
                relations: ['requestedBy', 'approvedBy', 'rejectedBy', 'items.product', 'branch']
            });
            if (!request) {
                throw new Error('Purchase request not found');
            }
            return request;
        });
    }
    generateRequestNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const lastRequest = yield this.repository
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
        });
    }
    create(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestNumber = yield this.generateRequestNumber();
            const items = data.items.map((item) => ({
                quantity: item.quantity,
                unit: item.unit,
                notes: item.notes,
                product: { id: item.productId },
            }));
            const request = this.repository.create({
                requestNumber,
                status: PurchaseRequest_1.PurchaseRequestStatus.PENDING,
                requestedBy: user,
                requestDate: new Date(),
                branch: { id: data.branchId },
                department: data.department,
                notes: data.notes,
                items: items,
            });
            return yield this.repository.save(request);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.findOne(id);
            const previousStatus = request.status;
            if (data.status === PurchaseRequest_1.PurchaseRequestStatus.PENDING) {
                if (!request.items || request.items.length === 0) {
                    throw new Error('Purchase request must have at least one item');
                }
            }
            if (data.status === PurchaseRequest_1.PurchaseRequestStatus.APPROVED) {
                if (!data.budgetCheck || !data.stockCheck || !data.supplierCheck) {
                    throw new Error('All checks must be completed before approval');
                }
                if (previousStatus !== PurchaseRequest_1.PurchaseRequestStatus.APPROVED) {
                    if (!data.products) {
                        throw new Error('Products are required when approving a purchase request.');
                    }
                    for (const item of data.products) {
                        if (!item.id) {
                            throw new Error(`Product ID not found for item in purchase request ${request.requestNumber}`);
                        }
                        const product2 = yield this.productRepository.findOne({
                            where: { id: item.id },
                            relations: ['productStocks']
                        });
                        if (!product2) {
                            throw new Error(`Product with ID ${item.id} not found.`);
                        }
                        const productStock = yield this.productStockRepository.findOne({
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
                        yield this.productStockRepository.save(productStock);
                    }
                }
            }
            if (data.status === PurchaseRequest_1.PurchaseRequestStatus.REJECTED) {
                if (!data.rejectionReason) {
                    throw new Error('Rejection reason is required');
                }
            }
            if (data.branchId) {
                const branch = yield this.branchRepository.findOneByOrFail({ id: data.branchId });
                request.branch = branch;
            }
            Object.assign(request, data);
            return yield this.repository.save(request);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.findOne(id);
            yield this.purchaseRequestItemRepository.delete({ purchaseRequest: { id } });
            yield this.repository.remove(request);
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOneByOrFail({ id });
        });
    }
}
exports.PurchaseRequestService = PurchaseRequestService;
