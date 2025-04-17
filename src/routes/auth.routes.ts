/** @format */

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/register", (req, res) => {
  authController.registerUser(req, res);
});

router.post("/login", (req, res) => {
  authController.loginUser(req, res);
});

export default router;
