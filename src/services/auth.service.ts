import bcrypt from "bcrypt";
import pool from "../db/connection";
import { authRepository } from "../repositories/auth.repository";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { errorTypes } from "../constants/errorTypes";

const saltRounds = 10;

async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
}

async function verifyPassword(password: string, hashedPassword: string) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

interface createUserProps {
  username: string;
  email: string;
  password: string;
}

const authRepositoryInstance = new authRepository();

export class authService {
  public async createUser({
    username,
    email,
    password,
  }: createUserProps): Promise<void> {
    const hashedPassword = await hashPassword(password);
    const values = [username, email, hashedPassword];

    const emailExists = await authRepositoryInstance.checkIfEmailExists(email);
    if (emailExists) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        errorTypes.EMAIL_ALREADY_EXISTS.message,
        {
          code: errorTypes.EMAIL_ALREADY_EXISTS.code,
        }
      );
    }

    const usernameExists = await authRepositoryInstance.checkIfUsernameExists(
      username
    );

    if (usernameExists) {
      throw new Error("Username already in use");
    }

    try {
      await authRepositoryInstance.insertUser(values);
    } catch (error) {
      console.error("Error during user creation:", error);
      throw new Error("User creation failed");
    }
  }
}
