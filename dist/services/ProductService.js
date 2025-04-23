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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const Warehouse_1 = require("../entity/Warehouse");
const ProductStock_1 = require("../entity/ProductStock");
const StockMutation_1 = require("../entity/StockMutation");
const typeorm_1 = require("typeorm");
const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
const warehouseRepo = data_source_1.AppDataSource.getRepository(Warehouse_1.Warehouse);
const productStockRepo = data_source_1.AppDataSource.getRepository(ProductStock_1.ProductStock);
const stockMutationRepo = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
class ProductService {
    static getAll(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page === undefined) {
                const data = yield productRepo.find({
                    relations: ["inventory_account_id", "sales_account", "purchase_account", "productStocks", "productStocks.warehouse", "stockMutations"],
                    order: {
                        createdAt: "DESC"
                    }
                });
                return { data };
            }
            const skip = (page - 1) * (limit || 10);
            const take = limit || 10;
            const [data, total] = yield productRepo.findAndCount({
                relations: ["inventory_account_id", "sales_account", "purchase_account", "productStocks", "productStocks.warehouse", "stockMutations"],
                skip,
                take,
                order: {
                    createdAt: "DESC"
                }
            });
            return {
                data,
                meta: {
                    total,
                    page,
                    limit: take,
                    totalPages: Math.ceil(total / take)
                }
            };
        });
    }
    static getById(id) {
        return productRepo.findOne({
            where: { id },
            relations: ["inventory_account_id", "sales_account", "purchase_account", "defaultSupplier", "productStocks", "productStocks.warehouse", "stockMutations"]
        });
    }
    static validateProduct(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, isUpdate = false) {
            if (data.sku) {
                const existingProduct = yield productRepo.findOne({
                    where: { sku: data.sku }
                });
                if (existingProduct && (!isUpdate || existingProduct.id !== data.id)) {
                    throw new Error("SKU sudah digunakan");
                }
            }
            if (data.price && data.cost && data.price < data.cost) {
                throw new Error("Harga jual tidak boleh lebih kecil dari harga beli");
            }
            if (data.minimumStock && data.minimumStock < 0) {
                throw new Error("Minimum stock tidak boleh negatif");
            }
            if (data.initial_stocks) {
                for (const stock of data.initial_stocks) {
                    if (stock.quantity < 0) {
                        throw new Error("Stok awal tidak boleh negatif");
                    }
                    const warehouse = yield warehouseRepo.findOneBy({ id: stock.warehouse_id });
                    if (!warehouse) {
                        throw new Error(`Warehouse dengan ID ${stock.warehouse_id} tidak ditemukan`);
                    }
                }
            }
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateProduct(data);
                const { initial_stocks } = data, productData = __rest(data, ["initial_stocks"]);
                const product = productRepo.create(productData);
                const savedProduct = yield productRepo.save(product);
                const warehouses = yield warehouseRepo.find();
                const productStocks = warehouses.map(warehouse => {
                    const initialStock = initial_stocks === null || initial_stocks === void 0 ? void 0 : initial_stocks.find(stock => stock.warehouse_id === warehouse.id);
                    return productStockRepo.create({
                        product: savedProduct,
                        warehouse: warehouse,
                        quantity: (initialStock === null || initialStock === void 0 ? void 0 : initialStock.quantity) || 0
                    });
                });
                yield productStockRepo.save(productStocks);
                if (initial_stocks) {
                    const stockMutations = initial_stocks.map(stock => {
                        if (stock.quantity > 0) {
                            return stockMutationRepo.create({
                                product: savedProduct,
                                quantity: stock.quantity,
                                type: "IN",
                                reference: "INITIAL_STOCK",
                                date: new Date()
                            });
                        }
                        return null;
                    }).filter((mutation) => mutation !== null);
                    if (stockMutations.length > 0) {
                        yield stockMutationRepo.save(stockMutations);
                    }
                }
                return this.getById(savedProduct.id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw {
                        status: 500,
                        message: "Error saat membuat produk: " + error.message
                    };
                }
                throw {
                    status: 500,
                    message: "Terjadi kesalahan saat membuat produk"
                };
            }
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateProduct(Object.assign(Object.assign({}, data), { id }), true);
                const { initial_stocks } = data, productData = __rest(data, ["initial_stocks"]);
                const existingProduct = yield productRepo.findOne({
                    where: { id },
                    relations: ["productStocks", "productStocks.warehouse"]
                });
                if (!existingProduct) {
                    throw new Error("Produk tidak ditemukan");
                }
                Object.assign(existingProduct, productData);
                const updatedProduct = yield productRepo.save(existingProduct);
                if (initial_stocks) {
                    for (const stock of updatedProduct.productStocks) {
                        const newStockData = initial_stocks.find(s => s.warehouse_id === stock.warehouse.id);
                        if (newStockData) {
                            const difference = newStockData.quantity - stock.quantity;
                            stock.quantity = newStockData.quantity;
                            yield productStockRepo.save(stock);
                            if (difference !== 0) {
                                yield stockMutationRepo.save({
                                    product: updatedProduct,
                                    quantity: Math.abs(difference),
                                    type: difference > 0 ? "IN" : "OUT",
                                    reference: "STOCK_ADJUSTMENT",
                                    date: new Date()
                                });
                            }
                        }
                    }
                    const existingWarehouseIds = updatedProduct.productStocks.map(stock => stock.warehouse.id);
                    const newWarehouses = yield warehouseRepo.find({
                        where: { id: (0, typeorm_1.Not)((0, typeorm_1.In)(existingWarehouseIds)) }
                    });
                    if (newWarehouses.length > 0) {
                        const newProductStocks = newWarehouses.map(warehouse => {
                            const initialStock = initial_stocks.find(stock => stock.warehouse_id === warehouse.id);
                            return productStockRepo.create({
                                product: updatedProduct,
                                warehouse: warehouse,
                                quantity: (initialStock === null || initialStock === void 0 ? void 0 : initialStock.quantity) || 0
                            });
                        });
                        yield productStockRepo.save(newProductStocks);
                        const newStockMutations = newProductStocks
                            .filter(stock => stock.quantity > 0)
                            .map(stock => {
                            return stockMutationRepo.create({
                                product: updatedProduct,
                                quantity: stock.quantity,
                                type: "IN",
                                reference: "INITIAL_STOCK",
                                date: new Date()
                            });
                        });
                        if (newStockMutations.length > 0) {
                            yield stockMutationRepo.save(newStockMutations);
                        }
                    }
                }
                return this.getById(id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw {
                        status: 500,
                        message: "Error saat memperbarui produk: " + error.message
                    };
                }
                throw {
                    status: 500,
                    message: "Terjadi kesalahan saat memperbarui produk"
                };
            }
        });
    }
    static delete(id) {
        return productRepo.delete(id);
    }
}
exports.ProductService = ProductService;
