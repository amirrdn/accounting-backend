import { Request, Response } from "express";
import { GeneralLedgerService } from "../services/GeneralLedgerService";

export class LedgerController {
  static async getGeneralLedger(req: Request, res: Response) {
    try {
      const accountId = +req.params.accountId;
      const start = new Date(req.query.start as string);
      const end = new Date(req.query.end as string);

      const data = await GeneralLedgerService.getLedger(accountId, start, end);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to get general ledger", error: err });
    }
  }
}
