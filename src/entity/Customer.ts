import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @Column({ nullable: true })
  npwp!: string;

  @Column({ nullable: true })
  isActive!: boolean;

  @Column({ name: "created_at", nullable: true })
  createdAt!: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt!: Date;
}