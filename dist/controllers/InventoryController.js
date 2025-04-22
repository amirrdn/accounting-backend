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
exports.InventoryController = void 0;
const data_source_1 = require("../data-source");
const StockMutation_1 = require("../entity/StockMutation");
const Product_1 = require("../entity/Product");
class InventoryController {
    static getStocks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mutationRepository = data_source_1.AppDataSource.getRepository(StockMutation_1.StockMutation);
                const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
                const products = yield productRepository.find();
                const stocks = yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
                    const mutations = yield mutationRepository.find({
                        where: { product: { id: product.id } },
                    });
                    const totalStock = mutations.reduce((sum, mutation) => {
                        return sum + (mutation.type === 'IN' ? mutation.quantity : -mutation.quantity);
                    }, 0);
                    return {
                        id: product.id,
                        product: {
                            id: product.id,
                            name: product.name,
                            sku: product.sku,
                            price: product.price,
                            cost: product.cost,
                            is_active: product.is_active,
                            minimumStock: product.minimumStock,
                        },
                        quantity: totalStock
                    };
                })));
                res.json(stocks);
            }
            catch (error) {
                console.error('Error fetching stocks:', error);
                res.status(500).json({ message: 'Gagal mengambil data stok' });
            }
        });
    }
}
exports.InventoryController = InventoryController;
