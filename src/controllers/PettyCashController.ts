import { Request, Response } from "express";
import { PettyCashService } from "../services/PettyCashService";
import { User } from "../entity/User";

interface CustomRequest extends Request {
    user?: {
      id: number;
      role: string;
    };
  }
export class PettyCashController {
    private pettyCashService: PettyCashService;

    constructor() {
        this.pettyCashService = new PettyCashService();
    }

    async create(req: CustomRequest, res: Response) {
        try {
            const { transactionDate, description, amount, type, receiptNumber, attachmentUrl } = req.body;
            const requestedBy = req.user as User;

            const pettyCash = await this.pettyCashService.create({
                transactionDate: new Date(transactionDate),
                description,
                amount,
                type,
                receiptNumber,
                attachmentUrl,
                requestedBy
            });

            return res.status(201).json(pettyCash);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const { status, type, startDate, endDate } = req.query;
            
            const pettyCashList = await this.pettyCashService.findAll({
                status: status as any,
                type: type as any,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined
            });

            return res.json(pettyCashList);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pettyCash = await this.pettyCashService.findById(Number(id));
            
            if (!pettyCash) {
                return res.status(404).json({ message: "Petty cash not found" });
            }

            return res.json(pettyCash);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }

    async approve(req: CustomRequest, res: Response) {
        try {
            const { id } = req.params;
            const approver = req.user as User;

            const pettyCash = await this.pettyCashService.approve(Number(id), approver);
            return res.json(pettyCash);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }

    async reject(req: CustomRequest, res: Response) {
        try {
            const { id } = req.params;
            const approver = req.user as User;

            const pettyCash = await this.pettyCashService.reject(Number(id), approver);
            return res.json(pettyCash);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getBalance(req: Request, res: Response) {
        try {
            const balance = await this.pettyCashService.getBalance();
            return res.json({
                status: "success",
                data: { balance }
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                code: "PETTY_CASH_GET_BALANCE_ERROR",
                message: "Terjadi kesalahan saat mengambil saldo petty cash"
            });
        }
    }
} 