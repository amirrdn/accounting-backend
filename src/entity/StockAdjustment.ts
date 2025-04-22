import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Product } from "./Product";
  import { User } from "./User";
  
  @Entity()
  export class StockAdjustment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: "product_id" })
    product!: Product;
  
    @Column({type: "int", name: "actual_stock"})
    actualStock!: number;
  
    @Column({type: "int", name: "system_stock"})
    systemStock!: number;
  
    @Column({type: "int", name: "difference"})
    difference!: number;
  
    @Column({ nullable: true })
    reason!: string;
  
    @Column({ default: 'DRAFT' })
    status!: 'DRAFT' | 'APPROVED' | 'REJECTED';
  
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "adjusted_by_id" })
    adjustedBy!: User;
  
    @CreateDateColumn({name: "adjusted_at"})
    adjustedAt!: Date;

    @CreateDateColumn({name: "created_at"})
    createdAt!: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt!: Date;
  }
  