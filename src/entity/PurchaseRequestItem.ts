import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { PurchaseRequest } from "./PurchaseRequest";

@Entity()
export class PurchaseRequestItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => PurchaseRequest)
  @JoinColumn({ name: "purchaseRequestId" })
  purchaseRequest!: PurchaseRequest;

  @ManyToOne(() => Product, product => product.items)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity!: number;

  @Column()
  unit!: string;

  @Column({ nullable: true })
  notes!: string;
} 