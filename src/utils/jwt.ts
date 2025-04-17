/** @format */

import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId: number): string => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new Error("Variáveis de ambiente JWT não configuradas");
  }

  const token = process.env.JWT_SECRET as string;

  const accessToken = jwt.sign({ userId }, token, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });

  return accessToken;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
