/** @format */

import { Request, Response } from "express";
import { object, z } from "zod";
import bcrypt from "bcrypt";
import pool from "../db/connection";
import { authService } from "../services/auth.service";
import { registerSchema } from "../schemas/registerSchema";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { formatError, formatSuccess } from "../utils/formatResponse";
import { loginSchema } from "../schemas/loginSchema";

const authServiceInstance = new authService();

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
      if (error instanceof createHttpError.HttpError) {
        const errorResponse = formatError(error.message, [
          { field: error.field ?? undefined, message: error.field_message || error.message },
        ]);

        console.error("Error during user registration:", error);
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

    const userExist = findUserByEmail(email);
  }
}
