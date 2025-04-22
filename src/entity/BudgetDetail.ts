import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Budget } from "./Budget";
import { Account } from "./Account";

@Entity()
export class BudgetDetail {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Budget, budget => budget.details)
    budget!: Budget;

    @ManyToOne(() => Account)
    account!: Account;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    januaryAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    februaryAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    marchAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    aprilAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    mayAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    juneAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    julyAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    augustAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    septemberAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    octoberAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    novemberAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    decemberAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    totalAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    actualAmount!: number;

    @Column("decimal", { precision: 15, scale: 2, default: 0 })
    varianceAmount!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 