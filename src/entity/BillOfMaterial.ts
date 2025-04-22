import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./Product";
import { BillOfMaterialItem } from "./BillOfMaterialItem";

@Entity()
export class BillOfMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @OneToMany(() => BillOfMaterialItem, item => item.bom, { cascade: true })
  items!: BillOfMaterialItem[];
}
