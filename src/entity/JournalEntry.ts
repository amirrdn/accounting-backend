import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToMany, CreateDateColumn, ManyToOne
  } from "typeorm";
  import { JournalDetail } from "./JournalDetail";
  import { Branch } from "./Branch";
  
  @Entity()
  export class JournalEntry {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    number!: string;

    @Column()
    reference!: string;
  
    @CreateDateColumn()
    date!: Date;
  
    @Column({ nullable: true })
    description!: string;
  
    @OneToMany(() => JournalDetail, detail => detail.journal, {
      cascade: true,
      eager: true
    })
    details!: JournalDetail[];
  
    @ManyToOne(() => Branch)
    branch!: Branch;
  }
  