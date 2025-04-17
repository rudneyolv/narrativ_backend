/** @format */

import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerSchema } from "../schemas/registerSchema";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { formatError, formatSuccess } from "../utils/formatResponse";
import { loginSchema } from "../schemas/loginSchema";
import { userService } from "../services/user.service";
import { userRepository } from "../repositories/user.repository";
import { UserStatus } from "../constants/enums";
import { verifyPassword } from "../utils/hashing";

const authServiceInstance = new authService();
const userRepositoryInstance = new userRepository();
export class AuthController {
  public async registerUser(req: Request, res: Response): Promise<Response> {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      const errorResponse = formatError("Password validation failed", [
        { field: "confirm_password", message: "Passwords do not match" },
      ]);

      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const validationResult = registerSchema.safeParse({
      username,
      email,
      password,
      confirm_password,
    });

    if (validationResult.error) {
      const errors = validationResult.error.errors.map((err) => ({
        message: err.message,
        field: err.path[0],
      }));

      const errorResponse = formatError("error.register_validation_failed", errors);
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    try {
      await authServiceInstance.createUser({ username, email, password });
      return res.status(StatusCodes.CREATED).json(formatSuccess("User successfully created"));
    } catch (error: unknown) {
      console.error("Error during user registration:", error);

      if (error instanceof createHttpError.HttpError) {
        const errorResponse = formatError(error.message, [
          { field: error.field ?? undefined, message: error.field_message || error.message },
        ]);

        return res.status(error.status).json(errorResponse);
      } else {
        const errorResponse = formatError("Internal server error", [
          { message: "An unexpected error occurred" },
        ]);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    }
  }

  public async loginUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const validationResult = loginSchema.safeParse({
      email,
    });

    if (validationResult.error) {
      const errors = validationResult.error.errors.map((err) => ({
        message: err.message,
        field: err.path[0],
      }));

      const errorResponse = formatError("error.login_validation_failed", errors);
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    try {
      const { token } = await authServiceInstance.loginUser({ email, password });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 dia igual no .env
      });

      return res.status(StatusCodes.ACCEPTED).json(formatSuccess("success.user_login"));
    } catch (error) {
      console.error("Error during user registration:", error);

      if (error instanceof createHttpError.HttpError) {
        const errorResponse = formatError(error.message, [
          { field: error.field ?? undefined, message: error.field_message || error.message },
        ]);

        return res.status(error.status).json(errorResponse);
      } else {
        const errorResponse = formatError("Internal server error", [
          { message: "An unexpected error occurred" },
        ]);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    }
  }
}
