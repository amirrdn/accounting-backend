import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn 
} from "typeorm";

@Entity()
export class AuditTrail {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    action!: string;

    @Column()
    entityName!: string;

    @Column()
    entityId!: string

    @Column({ type: 'json', nullable: true })
    oldValues: any;

    @Column({ type: 'json', nullable: true })
    newValues: any;
    
    @Column()
    ipAddress!: string;

    @Column({ nullable: true })
    userAgent!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    additionalInfo!: string;
} 