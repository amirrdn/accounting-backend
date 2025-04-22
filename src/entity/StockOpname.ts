import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  OneToMany, ManyToOne,
  JoinColumn,
  UpdateDateColumn
} from "typeorm";
import { StockOpnameItem } from "./StockOpnameItem";
import { Warehouse } from "./Warehouse";

@Entity()
export class StockOpname {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse!: Warehouse;

  @OneToMany(() => StockOpnameItem, item => item.stockOpname, {
    cascade: true,
    eager: true
  })
  items!: StockOpnameItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
