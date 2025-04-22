import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BudgetDetail } from "./BudgetDetail";

@Entity()
export class Budget {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    year!: number;

    @Column()
    description!: string;

    @Column()
    isActive!: boolean;

    @OneToMany(() => BudgetDetail, budgetDetail => budgetDetail.budget)
    details!: BudgetDetail[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 