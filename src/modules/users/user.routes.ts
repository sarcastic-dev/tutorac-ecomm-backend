import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import * as controller from "./user.controller";

export const userRoutes = Router();

userRoutes.get("/me", requireAuth, controller.getMe);
