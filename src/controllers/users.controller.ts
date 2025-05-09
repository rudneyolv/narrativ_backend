/** @format */

import { StatusCodes } from "http-status-codes";
import { formatError, formatSuccess } from "../utils/formatResponse";
import { Request, Response } from "express";
import { promise } from "zod";
import { userService } from "../services/user.service";
import createHttpError from "http-errors";
import { fallbackError } from "../constants/errors";
import { logError } from "../utils/debug/logError";

const userServiceInstance = new userService();

export class UsersController {
  public async fetchUserProfile(req: Request, res: Response) {
    const { username } = req.params;

    try {
      if (typeof username !== "string") {
        throw new Error("error.expected_an_string");
      }
      const profile = await userServiceInstance.fetchByUsername(username);
      const data = await formatSuccess("success.fetch_profile", profile);
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      return res.status(StatusCodes.OK).json(data);
    } catch (error) {
      logError("UsersController.fetchUserProfile", error);
      if (error instanceof createHttpError.HttpError) {
        const errorResponse = formatError(error.message, error.errors);
        return res.status(error.status).json(errorResponse);
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(fallbackError);
      }
    }
  }
}
