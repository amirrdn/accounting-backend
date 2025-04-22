import { Request, Response } from "express";
import { CashBankService } from "../services/CashBankService";

export class CashBankController {
  static async transfer(req: Request, res: Response) {
    try {
      const { sourceId, destinationAccountId, amount, description, branchId, date } = req.body;
      const result = await CashBankService.transfer(
        sourceId,
        destinationAccountId,
        amount,
        description,
        branchId,
        date
      );
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Saldo tidak cukup untuk transfer') {
        res.status(400).json({ message: 'Saldo tidak cukup untuk transfer' });
      } else if (error.message === 'Akun sumber dan tujuan tidak boleh sama') {
        res.status(400).json({ message: 'Akun sumber dan tujuan tidak boleh sama' });
      } else {
        res.status(500).json({ message: 'Terjadi kesalahan saat melakukan transfer' });
      }
    }
  }

  static async cashIn(req: Request, res: Response) {
    const { accountId, amount, description, branchId, destinationAccountId } = req.body;
    const result = await CashBankService.cashIn(accountId, amount, description, branchId, destinationAccountId);
    res.json(result);
  }

  static async cashOut(req: Request, res: Response) {
    const { accountId, amount, description, branchId, destinationAccountId, date } = req.body;
    const result = await CashBankService.cashOut(accountId, amount, description, branchId, destinationAccountId, date);
    res.json(result);
  }

  static async list(req: Request, res: Response) {
    const data = await CashBankService.listTransactions();
    res.json(data);
  }
  static async cashFlow(req: Request, res: Response) {
    const start = new Date(req.query.start as string);
    const end = new Date(req.query.end as string);
    const result = await CashBankService.getCashFlow(start, end);
    res.json(result);
  }

  static async approve(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await CashBankService.approve(id);
    res.json(result);
  }
  
}
