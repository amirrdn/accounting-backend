import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";

@Entity()
export class ProductionOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @Column("int")
  quantity!: number;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: "DRAFT" })
  status!: string;
}
