// validationSchemas.ts (arquivo separado)
import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." })
      .max(50, { message: "Username must be at most 50 characters." }),
    email: z
      .string()
      .min(2, { message: "Email must be at least 2 characters." })
      .email({ message: "Invalid email address." })
      .max(100, { message: "Email must be at most 100 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(100, { message: "Password must be at most 100 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match.",
    path: ["confirm_password"],
  });
