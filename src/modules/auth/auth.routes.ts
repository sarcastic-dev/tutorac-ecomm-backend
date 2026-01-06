import { Router } from "express";
import * as controller from "./auth.controller";

export const authRoutes = Router();

authRoutes.get("/health", (_req, res) => {
  res.json({ status: "Auth service running" });
});

authRoutes.post("/signup", controller.signup);
authRoutes.post("/login", controller.login);
