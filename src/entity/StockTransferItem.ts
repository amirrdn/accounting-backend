import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { StockTransfer } from "./StockTransfer";
  import { Product } from "./Product";
  
  @Entity()
  export class StockTransferItem {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => StockTransfer, transfer => transfer.items)
    @JoinColumn({ name: "transfer_id" })
    transfer!: StockTransfer;
  
    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product!: Product;
  
    @Column("int")
    quantity!: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  }
  