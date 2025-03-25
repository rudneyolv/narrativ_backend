import { Request, Response } from "express";
import { object, z } from "zod";
import bcrypt from "bcrypt";
import pool from "../db/connection";
import { authService } from "../services/auth.service";
import { registerSchema } from "../schemas/registerSchema";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

const authServiceInstance = new authService();

export class AuthController {
  public async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password, confirm_password } = req.body;

    const validationResult = registerSchema.safeParse({
      username,
      email,
      password,
      confirm_password,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        message: err.message,
        field: err.path[0],
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });

      return;
    }

    try {
      await authServiceInstance.createUser({ username, email, password });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User successfully created",
      });
    } catch (error: unknown) {
      if (error instanceof createHttpError.HttpError) {
        res.status(error.status).json({
          success: false,
          errors: [
            { message: error.message, field: error.field, code: error.code },
          ],
        });

        console.error("Error during user registration:", error);
      }
    }
  }
}
