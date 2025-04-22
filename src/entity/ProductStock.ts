import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
    JoinColumn
  } from "typeorm";
  import { Product } from "./Product";
  import { Warehouse } from "./Warehouse";
  
  @Entity()
  @Unique(["product", "warehouse"])
  export class ProductStock {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    product!: Product;
  
    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: "warehouseId" })
    warehouse!: Warehouse;
  
    @Column('decimal', { precision: 10, scale: 2 })
    quantity!: number;
  }
  