import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { StockMutation } from '../entity/StockMutation';
import { Product } from '../entity/Product';
import { Warehouse } from '../entity/Warehouse';

export class InventoryController {
  static async getStocks(req: Request, res: Response) {
    try {
      const mutationRepository = AppDataSource.getRepository(StockMutation);
      const productRepository = AppDataSource.getRepository(Product);
      
      const products = await productRepository.find();
      
      const stocks = await Promise.all(products.map(async (product) => {
        const mutations = await mutationRepository.find({
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
      }));

      res.json(stocks);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ message: 'Gagal mengambil data stok' });
    }
  }
} 