import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
  } from "typeorm";
  import { Supplier } from "./Supplier";
  import { PurchaseInvoiceItem } from "./PurchaseInvoiceItem";
  import { Account } from "./Account";
  import { Branch } from "./Branch";
  import { PurchaseOrder } from "./PurchaseOrder";
  import { PurchaseReceipt } from "./PurchaseReceipt";
  import { PurchasePayment } from "./PurchasePayment";
  
  export enum PurchaseInvoiceStatus {
    UNPAID = "UNPAID",
    PAID_PARTIAL = "PAID_PARTIAL",
    PAID_FULL = "PAID_FULL"
  }
  
  @Entity()
  export class PurchaseInvoice {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    invoiceNumber!: string;
  
    @Column({ name: "date", type: "date" })
    invoiceDate!: Date;
  
    @Column({ type: "date" })
    dueDate!: Date;
  
    @ManyToOne(() => Supplier)
    @JoinColumn()
    supplier!: Supplier;
  
    @ManyToOne(() => PurchaseOrder, { nullable: true })
    @JoinColumn()
    purchaseOrder!: PurchaseOrder;
  
    @ManyToOne(() => PurchaseReceipt, { nullable: true })
    @JoinColumn()
    purchaseReceipt!: PurchaseReceipt;
  
    @OneToMany(() => PurchaseInvoiceItem, item => item.purchaseInvoice, {
      cascade: true
    })
    items!: PurchaseInvoiceItem[];
  
    @OneToMany(() => PurchasePayment, (payment: PurchasePayment) => payment.purchaseInvoice)
    payments!: PurchasePayment[];
  
    @Column({
      type: "enum",
      enum: PurchaseInvoiceStatus,
      default: PurchaseInvoiceStatus.UNPAID
    })
    status!: PurchaseInvoiceStatus;
  
    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    subtotal!: number;
  
    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    taxAmount!: number;
  
    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    totalAmount!: number;
  
    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    paidAmount!: number;
  
    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    remainingAmount!: number;
  
    @Column({ default: false })
    isPpn!: boolean;
  
    @Column({ default: false })
    isPph!: boolean;
  
    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    ppnRate!: number;
  
    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    pphRate!: number;
  
    @Column({ nullable: true })
    notes!: string;
  
    @Column({ nullable: true })
    attachmentUrl!: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @ManyToOne(() => Account, { eager: true })
    payableAccount!: Account;
  
    @Column("decimal", { precision: 15, scale: 2 })
    total!: number;
  
    @ManyToOne(() => Branch)
    branch!: Branch;
  }
  