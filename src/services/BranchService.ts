import { AppDataSource } from "../data-source";
import { Branch } from "../entity/Branch";
import { Repository } from "typeorm";

export class BranchService {
    private branchRepository: Repository<Branch>;

    constructor() {
        this.branchRepository = AppDataSource.getRepository(Branch);
    }

    async create(data: Partial<Branch>): Promise<Branch> {
        const branch = this.branchRepository.create(data);
        return await this.branchRepository.save(branch);
    }

    async findAll(): Promise<Branch[]> {
        return await this.branchRepository.find();
    }

    async findOne(id: number): Promise<Branch | null> {
        return await this.branchRepository.findOneBy({ id });
    }

    async update(id: number, data: Partial<Branch>): Promise<Branch | null> {
        await this.branchRepository.update(id, data);
        return await this.branchRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<void> {
        await this.branchRepository.delete(id);
    }

    async getTransactionsByBranch(branchId: number, startDate: Date, endDate: Date) {
        const result = await this.branchRepository
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.cashBankTransactions", "cashBank")
            .leftJoinAndSelect("branch.journalEntries", "journal")
            .leftJoinAndSelect("branch.salesInvoices", "sales")
            .leftJoinAndSelect("branch.purchaseInvoices", "purchase")
            .where("branch.id = :branchId", { branchId })
            .andWhere("(cashBank.date BETWEEN :startDate AND :endDate OR " +
                      "journal.date BETWEEN :startDate AND :endDate OR " +
                      "sales.date BETWEEN :startDate AND :endDate OR " +
                      "purchase.date BETWEEN :startDate AND :endDate)", 
                      { startDate, endDate })
            .getOne();

        return result;
    }

    async getConsolidatedReport(startDate: Date, endDate: Date) {
        const result = await this.branchRepository
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.cashBankTransactions", "cashBank")
            .leftJoinAndSelect("branch.journalEntries", "journal")
            .leftJoinAndSelect("branch.salesInvoices", "sales")
            .leftJoinAndSelect("branch.purchaseInvoices", "purchase")
            .where("(cashBank.date BETWEEN :startDate AND :endDate OR " +
                   "journal.date BETWEEN :startDate AND :endDate OR " +
                   "sales.date BETWEEN :startDate AND :endDate OR " +
                   "purchase.date BETWEEN :startDate AND :endDate)",
                   { startDate, endDate })
            .getMany();

        return result;
    }
} 