import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn
  } from "typeorm";
  import { Account } from "./Account";
  
  @Entity()
  export class AccountSetting {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Account)
    @JoinColumn()
    salesAccount!: Account;
  
    @ManyToOne(() => Account)
    @JoinColumn()
    receivableAccount!: Account;
  
    @ManyToOne(() => Account)
    @JoinColumn()
    purchaseAccount!: Account;
  
    @ManyToOne(() => Account)
    @JoinColumn()
    payableAccount!: Account;
  
    @ManyToOne(() => Account)
    @JoinColumn()
    expenseAccount!: Account;
  
    @ManyToOne(() => Account)
    @JoinColumn()
    cashAccount!: Account;
  }
  