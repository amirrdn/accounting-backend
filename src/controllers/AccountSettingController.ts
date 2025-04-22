import { Request, Response } from "express";
import { AccountSettingService } from "../services/AccountSettingService";

export class AccountSettingController {
  static async get(req: Request, res: Response) {
    const data = await AccountSettingService.get();
    res.json(data);
  }

  static async update(req: Request, res: Response) {
    const data = await AccountSettingService.update(req.body);
    res.json(data);
  }
}
