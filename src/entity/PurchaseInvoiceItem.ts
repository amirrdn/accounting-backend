import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { PurchaseInvoice } from "./PurchaseInvoice";

@Entity()
export class PurchaseInvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => PurchaseInvoice)
  @JoinColumn()
  purchaseInvoice!: PurchaseInvoice;

  @ManyToOne(() => Product)
  @JoinColumn()
  product!: Product;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity!: number;

  @Column({ name: "price", type: "decimal", precision: 15, scale: 2 })
  unitPrice!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  subtotal!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  total!: number;
}
