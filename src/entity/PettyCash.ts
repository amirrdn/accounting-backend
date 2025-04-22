import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class PettyCash {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    transactionDate!: Date;

    @Column()
    description!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    amount!: number;

    @Column({
        type: "enum",
        enum: ["IN", "OUT"],
        default: "OUT"
    })
    type!: "IN" | "OUT";

    @Column({ nullable: true })
    receiptNumber!: string;

    @Column({ nullable: true })
    attachmentUrl!: string;

    @ManyToOne(() => User)
    @JoinColumn()
    requestedBy!: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn()
    approvedBy!: User;

    @Column({
        type: "enum",
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    })
    status!: "PENDING" | "APPROVED" | "REJECTED";

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 