import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn, RelationId } from "typeorm";
import { PurchaseInvoice } from "./PurchaseInvoice";
import { Account } from "./Account";

@Entity()
export class PurchasePayment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    paymentNumber!: string;
  
    @CreateDateColumn()
    paymentDate!: Date;
  
    @Column({ type: "decimal", precision: 15, scale: 2 })
    amount!: number;
  
    @ManyToOne(() => PurchaseInvoice, { nullable: false })
    @JoinColumn({ name: 'purchaseInvoiceId' })
    purchaseInvoice!: PurchaseInvoice;

    @Column({ nullable: true })
    purchaseInvoiceId!: number;

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'paymentAccountId' })
    paymentAccount!: Account;

    @Column({ nullable: true })
    paymentAccountId!: number;
  
    @Column({ nullable: true })
    notes!: string;
  
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  }