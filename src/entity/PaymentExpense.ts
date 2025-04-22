import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn
  } from "typeorm";
  import { Supplier } from "./Supplier";
  import { PurchaseInvoice } from "./PurchaseInvoice";
  import { Account } from "./Account";
  
  @Entity()
  export class PaymentExpense {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    paymentNumber!: string;
  
    @CreateDateColumn()
    date!: Date;
  
    @Column("decimal", { precision: 12, scale: 2 })
    amount!: number;
  
    @ManyToOne(() => Supplier)
    supplier!: Supplier;
  
    @ManyToOne(() => PurchaseInvoice)
    invoice!: PurchaseInvoice;
  
    @ManyToOne(() => Account)
    cashAccount!: Account;
  
    @Column({ nullable: true })
    note!: string;
  }
  