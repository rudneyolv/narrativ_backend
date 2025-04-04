/** @format */

import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId: number) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw createHttpError("JWT_SECRET ou JWT_EXPIRES_IN não definidos no .env");
  }

  if (userId || typeof userId !== "number") {
    throw createHttpError("Invalid userId");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
