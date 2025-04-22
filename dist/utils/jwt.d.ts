import jwt from "jsonwebtoken";
import { User } from "../entity/User";
export declare function generateToken(user: User): string;
export declare function verifyToken(token: string): string | jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map