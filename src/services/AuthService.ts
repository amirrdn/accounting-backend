import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

const userRepo = AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: { email: string; password: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = userRepo.create({ ...data, password: hashed });
    return userRepo.save(user);
  }

  static async login(email: string, password: string) {
    const user = await userRepo.findOneBy({ email });
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = generateToken(user);
    return { user, token };
  }

  static async changePassword(email: string, newPassword: string) {
    try {
      const user = await userRepo.findOneBy({ email });
      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      
      const updatedUser = await userRepo.save(user);
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          status: 500,
          message: "Error saat mengubah password: " + error.message
        };
      }
      throw {
        status: 500,
        message: "Terjadi kesalahan saat mengubah password"
      };
    }
  }
}
