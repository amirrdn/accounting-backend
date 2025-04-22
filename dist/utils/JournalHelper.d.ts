type JournalEntryInput = {
    reference: string;
    description: string;
    date?: Date;
    branch?: {
        id: number;
    };
    entries: {
        accountId: number;
        debit: number;
        credit: number;
        description?: string;
    }[];
};
export declare class JournalHelper {
    private static generateJournalNumber;
    static createJournal(data: JournalEntryInput, queryRunner?: any): Promise<any>;
}
export {};
//# sourceMappingURL=JournalHelper.d.ts.map