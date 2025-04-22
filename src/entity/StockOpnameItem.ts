import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { StockOpname } from "./StockOpname";
import { Product } from "./Product";

@Entity()
export class StockOpnameItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => StockOpname, (opname) => opname.items)
  @JoinColumn({ name: "stock_opname_id" })
  stockOpname!: StockOpname;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ name: "actual_qty" })
  actualQty!: number;

  @Column({ name: "system_qty" })
  systemQty!: number;

  @Column({ name: "diff_qty" })
  diffQty!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
