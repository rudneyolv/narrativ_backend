/** @format */

import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerSchema, RegisterUserBody } from "../schemas/registerSchema";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { formatError, formatSuccess } from "../utils/formatResponse";
import { loginSchema } from "../schemas/loginSchema";
import { fallbackError } from "../constants/errors";
import { logError } from "../utils/debug/logError";

const authServiceInstance = new authService();
export class AuthController {
  public async registerUser(
    req: Request<unknown, unknown, RegisterUserBody>,
    res: Response
  ): Promise<Response> {
    const { username, email, password, confirm_password } = req.body;

    const validationResult = registerSchema.safeParse({
      username,
      email,
      password,
      confirm_password,
    });

    if (validationResult.error) {
      const errors = validationResult.error.errors.map((err) => ({
        field_message: err.message,
        field: err.path[0],
      }));

      const errorResponse = formatError("error.register_validation_failed", errors);
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    try {
      const createUserProps = {
        username: username,
        email: email,
        password: password,
      };

      await authServiceInstance.createUser(createUserProps);

      const successResponse = formatSuccess("success_user_successfully_created");
      return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (error: unknown) {
      logError("AuthController.registerUser", error);

      if (error instanceof createHttpError.HttpError) {
        const errorResponse = formatError(error.message, error.errors);
        return res.status(error.status).json(errorResponse);
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(fallbackError);
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
        field_message: err.message,
        field: err.path[0],
      }));

      const errorResponse = formatError("error.login_validation_failed", errors);
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    try {
      const { token, username } = await authServiceInstance.loginUser({ email, password });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // alterar - 10 anos em milissegundos
      });

      res.cookie("username", username, {
        httpOnly: false,
        secure: true,
        sameSite: "lax",
      });

      return res
        .status(StatusCodes.ACCEPTED)
        .json(formatSuccess("success.user_login", { username: username }));
    } catch (error) {
      logError("AuthController.loginUser", error);

      if (error instanceof createHttpError.HttpError) {
        const errorResponse = formatError(error.message, error.errors);
        return res.status(error.status).json(errorResponse);
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(fallbackError);
      }
    }
  }
}
