/** @format */

import { Router } from "express";
import { UsersController } from "../controllers/users.controller";

const router = Router();
const UsersControllerInstance = new UsersController();

router.get("/:username", async (req, res) => {
  await UsersControllerInstance.fetchUserProfile(req, res); // Aguarda a função assíncrona
});

export default router;
