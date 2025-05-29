/** @format */

import { StatusCodes } from "http-status-codes";
import { formatError, formatSuccess } from "../utils/formatResponse";
import { Request, Response } from "express";
import { promise } from "zod";
import { userService } from "../services/user.service";
import createHttpError from "http-errors";
import { fallbackError } from "../constants/errors";
import { logError } from "../utils/debug/logError";
import { RequestWithUserProps } from "../interfaces/request.interfaces";
import { UserWithProfileProps } from "../interfaces/users.interfaces";

const userServiceInstance = new userService();

export class UsersController {
  public async fetchUserProfile(req: RequestWithUserProps, res: Response) {
    const { username } = req.params;
    const { userId: requestUserId } = req.user ?? {};

    try {
      if (typeof username !== "string") {
        throw new Error("error.expected_an_string");
      }

      const profile: UserWithProfileProps | null =
        await userServiceInstance.fetchWithProfileByUsername(username);

      const isOwner = profile?.id === requestUserId;

      if (!profile) {
        if (isOwner) {
          logError("Perfil do usuário logado não encontrado", { userId: requestUserId });
        }

        return res.status(StatusCodes.NOT_FOUND).json({ error: "profile_not_found" });
      }

      const returnData = {
        banner_image_url: profile?.banner_image_url,
        profile_image_url: profile?.profile_image_url,
        username: profile?.username,
        status: profile?.status,
        isOwner: isOwner,
      };

      const profileData = formatSuccess("success.fetch_profile", returnData);
      return res.status(StatusCodes.OK).json(profileData);
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
