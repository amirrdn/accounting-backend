import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn
  } from "typeorm";
  import { Customer } from "./Customer";
  import { SalesInvoice } from "./SalesInvoice";
  import { Account } from "./Account";
  
  @Entity()
  export class PaymentReceipt {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    paymentNumber!: string;
  
    @CreateDateColumn()
    date!: Date;
  
    @Column("decimal", { precision: 12, scale: 2 })
    amount!: number;
  
    @ManyToOne(() => Customer)
    customer!: Customer;
  
    @ManyToOne(() => SalesInvoice)
    invoice!: SalesInvoice;
  
    @ManyToOne(() => Account)
    cashAccount!: Account;
  
    @Column({ nullable: true })
    note!: string;
  }
  