import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";

@Entity()
@Unique(["product", "warehouse"])
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse!: Warehouse;

  @Column("int")
  quantity!: number;
}
