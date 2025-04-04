/** @format */

// validationSchemas.ts (arquivo separado)
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email must be at least 2 characters." })
    .email({ message: "error.invalid_email_address" })
    .max(100, { message: "Email must be at most 100 characters." }),
});
