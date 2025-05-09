/** @format */

import { authRepository } from "../repositories/auth.repository";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { hashPassword, verifyPassword } from "../utils/hashing";
import { formatError } from "../utils/formatResponse";
import { UserStatus } from "../constants/enums";
import { generateToken } from "../utils/jwt";
import { usersRepository } from "../repositories/users.repository";

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
const usersRepositoryInstance = new usersRepository();

export class authService {
  public async createUser({ username, email, password }: createUserProps): Promise<void> {
    try {
      const hashedPassword = await hashPassword(password);
      const values = [username, email, hashedPassword];

      const emailExists = await usersRepositoryInstance.findByEmail(email);

      if (emailExists) {
        throw createHttpError(StatusCodes.BAD_REQUEST, {
          message: "error.email_validation_failed",
          errors: [
            {
              field: "email",
              field_message: "validation.email_already_exists",
            },
          ],
        });
      }

      const usernameExists = await usersRepositoryInstance.findByUsername(username);

      if (usernameExists) {
        throw createHttpError(StatusCodes.BAD_REQUEST, {
          message: "error.username_validation_failed",
          errors: [
            {
              field: "username",
              field_message: "validation.username_already_in_use",
            },
          ],
        });
      }

      await authRepositoryInstance.insertUser(values);
    } catch (error) {
      throw error;
    }
  }

  public async loginUser({
    email,
    password,
  }: LoginUserProps): Promise<{ token: string; username: string }> {
    try {
      const user = await authRepositoryInstance.findUserWithPasswordByEmail(email);

      if (!user) {
        throw createHttpError(StatusCodes.BAD_REQUEST, {
          message: "error.email_not_registered",
          errors: [
            {
              field: "email",
              field_message: "error.email_not_registered",
            },
          ],
        });
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "error.account_not_active");
      }

      const isValidPassword = await verifyPassword(password, user.password);

      if (!isValidPassword) {
        throw createHttpError(StatusCodes.BAD_REQUEST, {
          message: "error.password_validation_failed",
          errors: [
            {
              field: "password",
              field_message: "error.wrong_password",
            },
          ],
        });
      }

      const token = generateToken(user.id);
      const username = user.username;

      return { token, username };
    } catch (error) {
      throw error;
    }
  }
}
