import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { PettyCash } from "../entity/PettyCash";
import { User } from "../entity/User";

export class PettyCashService {
    private pettyCashRepository: Repository<PettyCash>;

    constructor() {
        this.pettyCashRepository = AppDataSource.getRepository(PettyCash);
    }

    async create(data: {
        transactionDate: Date;
        description: string;
        amount: number;
        type: "IN" | "OUT";
        receiptNumber?: string;
        attachmentUrl?: string;
        requestedBy: User;
    }): Promise<PettyCash> {
        const pettyCash = this.pettyCashRepository.create(data);
        return await this.pettyCashRepository.save(pettyCash);
    }

    async findAll(options?: {
        status?: "PENDING" | "APPROVED" | "REJECTED";
        type?: "IN" | "OUT";
        startDate?: Date;
        endDate?: Date;
    }): Promise<PettyCash[]> {
        const query = this.pettyCashRepository.createQueryBuilder("pettyCash")
            .leftJoinAndSelect("pettyCash.requestedBy", "requestedBy")
            .leftJoinAndSelect("pettyCash.approvedBy", "approvedBy");

        if (options?.status) {
            query.andWhere("pettyCash.status = :status", { status: options.status });
        }
        if (options?.type) {
            query.andWhere("pettyCash.type = :type", { type: options.type });
        }
        if (options?.startDate) {
            query.andWhere("pettyCash.transactionDate >= :startDate", { startDate: options.startDate });
        }
        if (options?.endDate) {
            query.andWhere("pettyCash.transactionDate <= :endDate", { endDate: options.endDate });
        }

        return await query.getMany();
    }

    async findById(id: number): Promise<PettyCash | null> {
        return await this.pettyCashRepository.findOne({
            where: { id },
            relations: ["requestedBy", "approvedBy"]
        });
    }

    async approve(id: number, approver: User): Promise<PettyCash> {
        const pettyCash = await this.findById(id);
        if (!pettyCash) throw new Error("Petty cash not found");
        
        pettyCash.status = "APPROVED";
        pettyCash.approvedBy = approver;
        return await this.pettyCashRepository.save(pettyCash);
    }

    async reject(id: number, approver: User): Promise<PettyCash> {
        const pettyCash = await this.findById(id);
        if (!pettyCash) throw new Error("Petty cash not found");
        
        pettyCash.status = "REJECTED";
        pettyCash.approvedBy = approver;
        return await this.pettyCashRepository.save(pettyCash);
    }

    async getBalance(): Promise<number> {
        const result = await this.pettyCashRepository
            .createQueryBuilder("pettyCash")
            .where("pettyCash.status = :status", { status: "APPROVED" })
            .select("SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END)", "balance")
            .getRawOne();
        
        return result?.balance || 0;
    }
} 