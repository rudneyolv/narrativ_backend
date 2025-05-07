/** @format */

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authControllerInstance = new AuthController();

router.post("/register", (req, res) => {
  authControllerInstance.registerUser(req, res);
});

router.post("/login", (req, res) => {
  authControllerInstance.loginUser(req, res);
});

export default router;
