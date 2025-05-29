/** @format */

import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { optionalAuth } from "../middlewares/auth/optionalAuth";
import { RequestWithUserProps } from "../interfaces/request.interfaces";

const router = Router();
const UsersControllerInstance = new UsersController();

router.get("/:username", optionalAuth, async (req, res) => {
  await UsersControllerInstance.fetchUserProfile(req as RequestWithUserProps, res);
});

export default router;
