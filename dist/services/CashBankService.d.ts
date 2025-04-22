import { CashBankTransaction } from "../entity/CashBankTransaction";
export declare class CashBankService {
    static transfer(sourceId: number, destinationAccountId: number, amount: number, description: string | undefined, branchId: number, date?: Date): Promise<CashBankTransaction>;
    static cashIn(accountId: number, amount: number, description: string | undefined, branchId: number, destinationAccountId: number, date?: Date): Promise<CashBankTransaction>;
    static cashOut(accountId: number, amount: number, description: string | undefined, branchId: number, destinationAccountId: number, date?: Date): Promise<CashBankTransaction>;
    static listTransactions(): Promise<CashBankTransaction[]>;
    static getCashFlow(start: Date, end: Date): Promise<{
        cashIn: number;
        cashOut: number;
        transfer: number;
        details: {
            date: Date;
            type: "IN" | "OUT" | "TRANSFER";
            amount: number;
            description: string;
        }[];
    }>;
    static approve(id: number): Promise<CashBankTransaction>;
    static getAccountBalance(accountId: number): Promise<number>;
}
//# sourceMappingURL=CashBankService.d.ts.map