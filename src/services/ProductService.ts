import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { Warehouse } from "../entity/Warehouse";
import { ProductStock } from "../entity/ProductStock";
import { StockMutation } from "../entity/StockMutation";
import { Not, In } from "typeorm";

const productRepo = AppDataSource.getRepository(Product);
const warehouseRepo = AppDataSource.getRepository(Warehouse);
const productStockRepo = AppDataSource.getRepository(ProductStock);
const stockMutationRepo = AppDataSource.getRepository(StockMutation);

interface ProductCreateInput extends Partial<Product> {
  initial_stocks?: { warehouse_id: number; quantity: number }[];
}

export class ProductService {
  static async getAll(page?: number, limit?: number) {
    if (page === undefined) {
      const data = await productRepo.find({ 
        relations: ["inventory_account_id", "sales_account", "purchase_account", "productStocks", "productStocks.warehouse", "stockMutations"],
        order: {
          createdAt: "DESC"
        }
      });
      return { data };
    }

    const skip = (page - 1) * (limit || 10);
    const take = limit || 10;
    
    const [data, total] = await productRepo.findAndCount({ 
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
  }

  static getById(id: number) {
    return productRepo.findOne({
      where: { id },
      relations: ["inventory_account_id", "sales_account", "purchase_account", "defaultSupplier", "productStocks", "productStocks.warehouse", "stockMutations"]
    });
  }

  static async validateProduct(data: ProductCreateInput, isUpdate = false) {
    if (data.sku) {
      const existingProduct = await productRepo.findOne({
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
        const warehouse = await warehouseRepo.findOneBy({ id: stock.warehouse_id });
        if (!warehouse) {
          throw new Error(`Warehouse dengan ID ${stock.warehouse_id} tidak ditemukan`);
        }
      }
    }
  }

  static async create(data: ProductCreateInput) {
    try {
      await this.validateProduct(data);

      const { initial_stocks, ...productData } = data;
      
      const product = productRepo.create(productData);
      const savedProduct = await productRepo.save(product);
      
      const warehouses = await warehouseRepo.find();
      
      const productStocks = warehouses.map(warehouse => {
        const initialStock = initial_stocks?.find(
          stock => stock.warehouse_id === warehouse.id
        );
        
        return productStockRepo.create({
          product: savedProduct,
          warehouse: warehouse,
          quantity: initialStock?.quantity || 0
        });
      });
      
      await productStockRepo.save(productStocks);

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
        }).filter((mutation): mutation is StockMutation => mutation !== null);

        if (stockMutations.length > 0) {
          await stockMutationRepo.save(stockMutations);
        }
      }
      
      return this.getById(savedProduct.id);
    } catch (error) {
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
  }

  static async update(id: number, data: ProductCreateInput) {
    try {
      await this.validateProduct({ ...data, id }, true);

      const { initial_stocks, ...productData } = data;
      
      const existingProduct = await productRepo.findOne({
        where: { id },
        relations: ["productStocks", "productStocks.warehouse"]
      });

      if (!existingProduct) {
        throw new Error("Produk tidak ditemukan");
      }

      Object.assign(existingProduct, productData);
      const updatedProduct = await productRepo.save(existingProduct);

      if (initial_stocks) {
        for (const stock of updatedProduct.productStocks) {
          const newStockData = initial_stocks.find(
            s => s.warehouse_id === stock.warehouse.id
          );
          
          if (newStockData) {
            const difference = newStockData.quantity - stock.quantity;
            
            stock.quantity = newStockData.quantity;
            await productStockRepo.save(stock);

            if (difference !== 0) {
              await stockMutationRepo.save({
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
        const newWarehouses = await warehouseRepo.find({
          where: { id: Not(In(existingWarehouseIds)) }
        });

        if (newWarehouses.length > 0) {
          const newProductStocks = newWarehouses.map(warehouse => {
            const initialStock = initial_stocks.find(
              stock => stock.warehouse_id === warehouse.id
            );

            return productStockRepo.create({
              product: updatedProduct,
              warehouse: warehouse,
              quantity: initialStock?.quantity || 0
            });
          });

          await productStockRepo.save(newProductStocks);

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
            await stockMutationRepo.save(newStockMutations);
          }
        }
      }

      return this.getById(id);
    } catch (error) {
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
  }

  static delete(id: number) {
    return productRepo.delete(id);
  }
}
