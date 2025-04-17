/** @format */

import { authRepository } from "../repositories/auth.repository";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { hashPassword, verifyPassword } from "../utils/hashing";
import { userRepository } from "../repositories/user.repository";
import { formatError } from "../utils/formatResponse";
import { UserStatus } from "../constants/enums";
import { generateToken } from "../utils/jwt";

interface createUserProps {
  username: string;
  email: string;
  password: string;
}

interface LoginUserProps {
  email: string;
  password: string;
}

const authRepositoryInstance = new authRepository();
const userRepositoryInstance = new userRepository();

export class authService {
  public async createUser({ username, email, password }: createUserProps): Promise<void> {
    const hashedPassword = await hashPassword(password);
    const values = [username, email, hashedPassword];

    const emailExists = await userRepositoryInstance.findByEmail(email);

    if (emailExists) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Email validation failed", {
        field: "email",
        field_message: "validation.email_already_exists",
      });
    }

    const usernameExists = await userRepositoryInstance.findByUsername(username);

    if (usernameExists) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Username validation failed", {
        field: "username",
        field_message: "validation.username_already_in_use",
      });
    }

    try {
      await authRepositoryInstance.insertUser(values);
    } catch (error) {
      console.error("Error during user creation:", error);
      throw createHttpError(StatusCodes.BAD_REQUEST, "Error during user creation");
    }
  }

  public async loginUser({ email, password }: LoginUserProps): Promise<{ token: string }> {
    const user = await userRepositoryInstance.findByEmail(email);

    if (!user) {
      throw createHttpError(StatusCodes.BAD_REQUEST, {
        field: "email",
        message: "error.email_not_registered",
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "error.account_not_active");
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "error.account_not_active", {
        field: "password",
        message: "error.wrong_password",
      });
    }

    const token = generateToken(user.id);

    return { token };
  }
}
