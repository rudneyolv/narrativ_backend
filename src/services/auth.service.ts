/** @format */

import { authRepository } from "../repositories/auth.repository";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { hashPassword, verifyPassword } from "../utils/hashing";
import { UserStatus } from "../constants/enums";
import { generateToken } from "../utils/jwt";
import { usersRepository } from "../repositories/users.repository";
import { createUserProps, LoginUserProps, PrivateUser } from "../interfaces/auth.interfaces";

const authRepositoryInstance = new authRepository();
const usersRepositoryInstance = new usersRepository();

export class authService {
  public async createUser(userData: createUserProps): Promise<PrivateUser> {
    const { username, email, password } = userData;
    const hashedPassword = await hashPassword(password);

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

    const insertUserData = { username: username, email: email, hashed_password: hashedPassword };
    const user = await authRepositoryInstance.insertUser(insertUserData);
    return user;
  }

  public async loginUser({
    email,
    password,
  }: LoginUserProps): Promise<{ token: string; username: string }> {
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

    const token = generateToken(user.id);
    const username = user.username;

    return { token, username };
  }
}
