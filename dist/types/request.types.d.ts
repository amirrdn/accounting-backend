import { Request } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}
//# sourceMappingURL=request.types.d.ts.map