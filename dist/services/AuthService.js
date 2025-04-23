"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
class AuthService {
    static register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashed = yield bcryptjs_1.default.hash(data.password, 10);
            const user = userRepo.create(Object.assign(Object.assign({}, data), { password: hashed }));
            return userRepo.save(user);
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepo.findOneBy({ email });
            if (!user)
                return null;
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch)
                return null;
            const token = (0, jwt_1.generateToken)(user);
            return { user, token };
        });
    }
    static changePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userRepo.findOneBy({ email });
                if (!user) {
                    throw new Error("User tidak ditemukan");
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                user.password = hashedPassword;
                const updatedUser = yield userRepo.save(user);
                return updatedUser;
            }
            catch (error) {
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
        });
    }
}
exports.AuthService = AuthService;
