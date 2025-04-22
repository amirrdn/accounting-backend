import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, CreateDateColumn,
    JoinColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Customer } from "./Customer";
  import { SalesInvoiceItem } from "./SalesInvoiceItem";
  import { Account } from "./Account";
  import { Branch } from "./Branch";
  
  @Entity()
  export class SalesInvoice {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    invoice_number!: string;
  
    @CreateDateColumn()
    date!: Date;
  
    @ManyToOne(() => Customer, { eager: true })
    @JoinColumn({name: 'customer_id'})
    customer!: Customer;
  
    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: "receivable_account_id" })
    receivableAccount!: Account;
    
    @Column("decimal", { precision: 15, scale: 2 })
    total!: number;
    
    @OneToMany(() => SalesInvoiceItem, item => item.invoice, {
      cascade: true,
      eager: true
    })
    items!: SalesInvoiceItem[];
    
    @ManyToOne(() => Branch)
    @JoinColumn({ name: "branch_id" })
    branch!: Branch;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @Column({ nullable: true })
    notes!: string;
  }
  