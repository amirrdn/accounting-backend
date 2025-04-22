import { Account } from "../entity/Account";
export declare class AccountService {
    static getAllNoPaginate(): Promise<Account[]>;
    static getById(id: number): Promise<Account | null>;
    static create(data: Partial<Account>): Promise<Account>;
    static update(id: number, data: Partial<Account>): Promise<Account | null>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
    static getAll(page: number, limit: number): Promise<{
        data: {
            balance: number;
            id: number;
            code: string;
            name: string;
            type: "asset" | "liability" | "equity" | "revenue" | "expense" | "cash" | "bank";
            createdAt: Date;
            updatedAt: Date;
            parent: Account;
        }[];
        total: number;
    }>;
}
//# sourceMappingURL=AccountService.d.ts.map