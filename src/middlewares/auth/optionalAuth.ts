/** @format */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface optionalAuthRequest extends Request {
  user?: any;
}

export const optionalAuth = (req: optionalAuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    req.user = { userId: null, isAuthenticated: false };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "object" && decoded !== null) {
      req.user = { ...decoded, isAuthenticated: true };
    }
  } catch (error) {
    console.log("🟡 Token inválido, seguindo como visitante");
  }

  return next();
};
