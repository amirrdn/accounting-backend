import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    UpdateDateColumn,
    CreateDateColumn
  } from "typeorm";
  import { Warehouse } from "./Warehouse";
  import { StockTransferItem } from "./StockTransferItem";

  export enum StockTransferStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    RECEIVED = "RECEIVED",
  }
  
  
  @Entity()
  export class StockTransfer {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ name: "transfer_date" })
    transferDate!: Date;
  
    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: "from_warehouse_id" })
    fromWarehouse!: Warehouse;
  
    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: "to_warehouse_id" })
    toWarehouse!: Warehouse;
  
    @Column({ default: "SENT" })
    status!: string;
  
    @OneToMany(() => StockTransferItem, item => item.transfer, { cascade: true })
    items!: StockTransferItem[];

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  }
  