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
import { Supplier } from "./Supplier";
import { Branch } from "./Branch";
import { PurchaseOrderItem } from "./PurchaseOrderItem";
import { User } from "./User";

export enum PurchaseOrderStatus {
    DRAFT = "DRAFT",
    APPROVED = "APPROVED",
    SENT = "SENT",
    RECEIVED_PARTIAL = "RECEIVED_PARTIAL",
    RECEIVED_FULL = "RECEIVED_FULL"
}

@Entity()
export class PurchaseOrder {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    poNumber!: string;

    @Column({ type: "date" })
    orderDate!: Date;

    @Column({ type: "date" })
    expectedDeliveryDate!: Date;

    @ManyToOne(() => Supplier)
    @JoinColumn()
    supplier!: Supplier;

    @ManyToOne(() => Branch)
    @JoinColumn()
    branch!: Branch;

    @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder, {
        cascade: true
    })
    items!: PurchaseOrderItem[];

    @Column({
        type: "enum",
        enum: PurchaseOrderStatus,
        default: PurchaseOrderStatus.DRAFT
    })
    status!: PurchaseOrderStatus;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    subtotal!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    taxAmount!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    totalAmount!: number;

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

    @Column({ name: 'approval_notes', nullable: true })
    approvalNotes!: string;

    @Column({ name: 'approval_date', type: "date", nullable: true })
    approvalDate!: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'approved_by' })
    approvedBy!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 