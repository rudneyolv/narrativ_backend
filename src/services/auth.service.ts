/** @format */

import { authRepository } from "../repositories/auth.repository";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { hashPassword } from "../utils/hashing";

const saltRounds = 10;

interface createUserProps {
  username: string;
  email: string;
  password: string;
}

const authRepositoryInstance = new authRepository();

export class authService {
  public async createUser({ username, email, password }: createUserProps): Promise<void> {
    const hashedPassword = await hashPassword(password);
    const values = [username, email, hashedPassword];

    const emailExists = await authRepositoryInstance.checkIfEmailExists(email);

    if (emailExists) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Email validation failed", {
        field: "email",
        field_message: "validation.email_already_exists",
      });
    }

    const usernameExists = await authRepositoryInstance.checkIfUsernameExists(username);

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
}
