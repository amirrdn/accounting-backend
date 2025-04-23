import { JournalEntry } from "../entity/JournalEntry";
export declare class JournalEntryService {
    static getAll(): Promise<JournalEntry[]>;
    static getById(id: number): Promise<JournalEntry | null>;
    static create(data: Partial<JournalEntry>): Promise<JournalEntry>;
    static update(id: number, data: Partial<JournalEntry>): Promise<JournalEntry | null>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=JournalEntryService.d.ts.map