import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { JournalEntry } from "./JournalEntry";
import { Account } from "./Account";

@Entity()
export class JournalDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => JournalEntry, journal => journal.details)
  @JoinColumn({ name: "journalEntryId" })
  journal!: JournalEntry;

  @ManyToOne(() => Account, { eager: true })
  account!: Account;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  debit!: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  credit!: number;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
