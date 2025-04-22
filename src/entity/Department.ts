import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    code!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 