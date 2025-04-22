import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { PurchaseOrder } from "./PurchaseOrder";

@Entity()
export class PurchaseOrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => PurchaseOrder)
    @JoinColumn()
    purchaseOrder!: PurchaseOrder;

    @ManyToOne(() => Product)
    @JoinColumn()
    product!: Product;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity!: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    discount!: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    subtotal!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    taxAmount!: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    total!: number;
} 