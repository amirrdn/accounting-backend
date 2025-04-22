import { AppDataSource } from "../data-source";
import { AccountSetting } from "../entity/AccountSetting";

const repo = AppDataSource.getRepository(AccountSetting);

export class AccountSettingService {
  static async get() {
    let setting = await repo.findOne({
      relations: ["salesAccount", "receivableAccount", "purchaseAccount", "payableAccount", "expenseAccount", "cashAccount"],
    });

    if (!setting) {
      setting = await repo.save(repo.create());
    }

    return setting;
  }

  static async update(data: Partial<AccountSetting>) {
    const current = await this.get();
    repo.merge(current, data);
    return repo.save(current);
  }
}
