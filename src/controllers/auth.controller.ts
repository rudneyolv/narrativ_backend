import { Request, Response } from "express";
import { object, z } from "zod";
import pool from "../db/connection";

export class AuthController {
  public async registerUser(req: Request, res: Response): Promise<void> {
    const registerSchema = z
      .object({
        username: z
          .string()
          .min(2, {
            message: "Username must be at least 2 characters.",
          })
          .max(50, {
            message: "Username must be at most 50 characters.",
          }),

        email: z
          .string()
          .min(2, {
            message: "Email must be at least 2 characters.",
          })
          .email({
            message: "Invalid email address.",
          })
          .max(100, {
            message: "Email must be at most 100 characters.",
          }),

        password: z
          .string()
          .min(8, {
            message: "Password must be at least 8 characters.",
          })
          .max(100, {
            message: "Password must be at most 100 characters.",
          })
          .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
          })
          .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
          })
          .regex(/[0-9]/, {
            message: "Password must contain at least one number.",
          })
          .regex(/[\W_]/, {
            message: "Password must contain at least one special character.",
          }),

        confirm_password: z.string(),
      })
      .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match.",
        path: ["confirm_password"],
      });

    const validationResult = registerSchema.safeParse(req.body);

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
    }

    const { confirm_password, ...userWithoutConfirm } = req.body;
    const values = Object.values(userWithoutConfirm);

    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, values);
  }
}
