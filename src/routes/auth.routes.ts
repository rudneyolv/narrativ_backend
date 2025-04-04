/** @format */

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
const router = Router();

router.post("/register", (req, res) => {
  authController.registerUser(req, res);
});

router.post("/login", (req, res) => {
  authController.loginUser(req, res);
});

export default router;
