import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany
} from "typeorm";
import {
    Account
} from "./Account";
import { Supplier } from "./Supplier";
import { StockMutation } from "./StockMutation";
import { Stock } from "./Stock";
import { BillOfMaterial } from "./BillOfMaterial";
import { BillOfMaterialItem } from "./BillOfMaterialItem";
import { PurchaseOrderItem } from "./PurchaseOrderItem";
import { PurchaseInvoiceItem } from "./PurchaseInvoiceItem";
import { SalesInvoiceItem } from "./SalesInvoiceItem";
import { StockOpnameItem } from "./StockOpnameItem";
import { StockAdjustment } from "./StockAdjustment";
import { ProductionOrder } from "./ProductionOrder";
import { PurchaseRequestItem } from "./PurchaseRequestItem";
import { PurchaseReceiptItem } from "./PurchaseReceiptItem";
import { StockTransferItem } from "./StockTransferItem";
import { ProductStock } from "./ProductStock";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        nullable: true
    })
    sku!: string;

    @Column("decimal", {
        precision: 15,
        scale: 2,
        default: 0
    })
    price!: number;

    @Column("decimal", {
        precision: 15,
        scale: 2,
        default: 0
    })
    cost!: number;

    @Column("boolean", {
        default: true
    })
    is_active!: boolean;

    @ManyToOne(() => Account, {
        nullable: true
    })
    @JoinColumn({ name: "inventory_account_id" })
    inventory_account_id!: Account;

    @ManyToOne(() => Account, {
        nullable: true
    })
    @JoinColumn({ name: "sales_account_id" })
    sales_account!: Account;

    @ManyToOne(() => Account, {
        nullable: true
    })
    @JoinColumn({ name: "purchase_account_id" })
    purchase_account!: Account;

    @Column({
        type: "int",
        default: 0
    })
    minimumStock!: number;

    @ManyToOne(() => Supplier, { nullable: true, eager: true })
    @JoinColumn({ name: "default_supplier_id" })
    defaultSupplier!: Supplier;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => StockMutation, stockMutation => stockMutation.product)
    stockMutations!: StockMutation[];

    @OneToMany(() => Stock, stock => stock.product)
    stocks!: Stock[];

    @OneToMany(() => BillOfMaterial, bom => bom.product)
    billOfMaterials!: BillOfMaterial[];

    @OneToMany(() => BillOfMaterialItem, bomItem => bomItem.material)
    billOfMaterialItems!: BillOfMaterialItem[];

    @OneToMany(() => PurchaseOrderItem, poItem => poItem.product)
    purchaseOrderItems!: PurchaseOrderItem[];

    @OneToMany(() => PurchaseInvoiceItem, piItem => piItem.product)
    purchaseInvoiceItems!: PurchaseInvoiceItem[];

    @OneToMany(() => SalesInvoiceItem, siItem => siItem.product)
    salesInvoiceItems!: SalesInvoiceItem[];

    @OneToMany(() => StockOpnameItem, soItem => soItem.product)
    stockOpnameItems!: StockOpnameItem[];

    @OneToMany(() => StockAdjustment, adjustment => adjustment.product)
    stockAdjustments!: StockAdjustment[];

    @OneToMany(() => ProductionOrder, po => po.product)
    productionOrders!: ProductionOrder[];

    @OneToMany(() => PurchaseRequestItem, item => item.product)
    items!: PurchaseRequestItem[];

    @OneToMany(() => PurchaseReceiptItem, prItem => prItem.product)
    purchaseReceiptItems!: PurchaseReceiptItem[];

    @OneToMany(() => StockTransferItem, stItem => stItem.product)
    stockTransferItems!: StockTransferItem[];

    @OneToMany(() => ProductStock, productStock => productStock.product)
    productStocks!: ProductStock[];
}
