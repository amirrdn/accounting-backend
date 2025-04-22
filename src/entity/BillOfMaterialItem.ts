import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Product } from "./Product";
import { BillOfMaterial } from "./BillOfMaterial";

@Entity()
export class BillOfMaterialItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => BillOfMaterial)
  bom!: BillOfMaterial;

  @ManyToOne(() => Product)
  material!: Product;

  @Column("int")
  quantity!: number;
}
