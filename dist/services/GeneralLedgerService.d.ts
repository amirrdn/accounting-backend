export declare class GeneralLedgerService {
    static getLedger(accountId: number, start: Date, end: Date): Promise<{
        date: Date;
        description: string;
        debit: number;
        credit: number;
        saldo: number;
    }[]>;
}
//# sourceMappingURL=GeneralLedgerService.d.ts.map