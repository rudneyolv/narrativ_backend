/** @format */

import { Request } from "express";

export interface AuthenticatedUser {
  userId: number | null;
  iat?: number;
  exp?: number;
  isAuthenticated: boolean;
}

export interface RequestWithUserProps extends Request {
  user: AuthenticatedUser;
}
