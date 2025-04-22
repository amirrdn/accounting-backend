export declare class Account {
    id: number;
    code: string;
    name: string;
    type: "asset" | "liability" | "equity" | "revenue" | "expense" | "cash" | "bank";
    createdAt: Date;
    updatedAt: Date;
    parent: Account;
}
//# sourceMappingURL=Account.d.ts.map