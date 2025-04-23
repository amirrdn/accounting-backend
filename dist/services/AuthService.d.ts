import { User } from "../entity/User";
export declare class AuthService {
    static register(data: {
        email: string;
        password: string;
    }): Promise<User>;
    static login(email: string, password: string): Promise<{
        user: User;
        token: any;
    } | null>;
    static changePassword(email: string, newPassword: string): Promise<User>;
}
//# sourceMappingURL=AuthService.d.ts.map