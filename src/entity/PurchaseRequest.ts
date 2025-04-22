import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { User } from "./User";
import { Branch } from "./Branch";
import { PurchaseRequestItem } from "./PurchaseRequestItem";
import { Warehouse } from "./Warehouse";

export enum PurchaseRequestStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum RejectionReason {
  BUDGET_EXCEEDED = "BUDGET_EXCEEDED",
  SUPPLIER_ISSUE = "SUPPLIER_ISSUE",
  STOCK_AVAILABLE = "STOCK_AVAILABLE",
  OTHER = "OTHER"
}

@Entity()
export class PurchaseRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  requestNumber!: string;

  @Column({ type: "date" })
  requestDate!: Date;

  @Column()
  department!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "requestedById"})
  requestedBy!: User;

  @ManyToOne(() => Branch)
  @JoinColumn()
  branch!: Branch;

  @OneToMany(() => PurchaseRequestItem, item => item.purchaseRequest, {
    cascade: true
  })
  items!: PurchaseRequestItem[];

  @Column({
    type: "enum",
    enum: PurchaseRequestStatus,
    default: PurchaseRequestStatus.DRAFT
  })
  status!: PurchaseRequestStatus;

  @Column({ nullable: true })
  notes!: string;

  @Column({ nullable: true })
  approvalNotes!: string;

  @Column({ type: "date", nullable: true })
  approvalDate!: Date;

  @Column({ nullable: true })
  budgetCheck!: string;

  @Column({ nullable: true })
  stockCheck!: string;

  @Column({ nullable: true })
  supplierCheck!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  approvedBy!: User;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @Column({ nullable: true })
  rejectionNotes!: string;

  @Column({ type: "date", nullable: true })
  rejectionDate!: Date;

  @Column({
    type: "enum",
    enum: RejectionReason,
    nullable: true
  })
  rejectionReason!: RejectionReason;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  rejectedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 