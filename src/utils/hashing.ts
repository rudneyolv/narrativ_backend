/** @format */
import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};
