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
import { PurchaseOrder } from "./PurchaseOrder";
import { Branch } from "./Branch";
import { PurchaseReceiptItem } from "./PurchaseReceiptItem";

export enum PurchaseReceiptStatus {
    DRAFT = "DRAFT",
    COMPLETED = "COMPLETED"
}

@Entity()
export class PurchaseReceipt {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    receiptNumber!: string;

    @Column({ type: "date" })
    receiptDate!: Date;

    @ManyToOne(() => PurchaseOrder)
    @JoinColumn()
    purchaseOrder!: PurchaseOrder;

    @ManyToOne(() => Branch)
    @JoinColumn()
    branch!: Branch;

    @OneToMany(() => PurchaseReceiptItem, (item: PurchaseReceiptItem) => item.purchaseReceipt, {
        cascade: true
    })
    items!: PurchaseReceiptItem[];

    @Column({
        type: "enum",
        enum: PurchaseReceiptStatus,
        default: PurchaseReceiptStatus.DRAFT
    })
    status!: PurchaseReceiptStatus;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    totalAmount!: number;

    @Column({ nullable: true })
    notes!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 