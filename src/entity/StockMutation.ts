import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from "typeorm";
import { Product } from "./Product";

/**
 * Entity StockMutation digunakan untuk mencatat pergerakan stok produk
 * baik itu penambahan (IN) maupun pengurangan (OUT)
 */
@Entity()
export class StockMutation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column()
  reference!: string;
  
  @Column({ type: "enum", enum: ["IN", "OUT"] })
  type!: "IN" | "OUT";

  @Column("int")
  quantity!: number;

  @Column("timestamp")
  date!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @CreateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
function joinColumn(arg0: { name: string; }): (target: StockMutation, propertyKey: "product") => void {
  throw new Error("Function not implemented.");
}

