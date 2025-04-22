import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SalesInvoice } from "./SalesInvoice";
import { Product } from "./Product";

@Entity()
export class SalesInvoiceItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => SalesInvoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salesInvoiceId' })
  invoice!: SalesInvoice;

  @Column()
  salesInvoiceId!: number;

  @ManyToOne(() => Product, { eager: true })
  product!: Product;

  @Column()
  quantity!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  price!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  total!: number;
}
