import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Account } from "./Account";
  import { Branch } from "./Branch";
  
  @Entity("cash_bank_transaction")
  export class CashBankTransaction {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    date!: Date;
  
    @Column()
    type!: "IN" | "OUT" | "TRANSFER";
  
    @Column({ type: "decimal", precision: 15, scale: 2 })
    amount!: number;
  
    @Column({ nullable: true })
    description!: string;
  
    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: "accountId" })
    sourceAccount!: Account;

    @Column({ nullable: true })
    accountId!: number;
  
    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: "destinationAccountId" })
    destinationAccount!: Account;

    @Column({ nullable: true })
    destinationAccountId!: number;

    @Column({ default: false })
    isApproved!: boolean;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: "branchId" })
    branch!: Branch;

    @Column({ nullable: true })
    branchId!: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  }
  