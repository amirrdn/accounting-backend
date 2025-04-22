import jwt from "jsonwebtoken";
import { User } from "../entity/User";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function generateToken(user: User) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
