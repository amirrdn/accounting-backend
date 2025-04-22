import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { PurchaseReceipt } from "./PurchaseReceipt";

@Entity()
export class PurchaseReceiptItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => PurchaseReceipt, receipt => receipt.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchaseReceiptId' })
    purchaseReceipt!: PurchaseReceipt;

    @ManyToOne(() => Product)
    @JoinColumn()
    product!: Product;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity!: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    subtotal!: number;
} 