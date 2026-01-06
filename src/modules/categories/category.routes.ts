import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import * as controller from "./category.controller";

export const categoryRoutes = Router();

categoryRoutes.post("/", requireAuth, requireAdmin, controller.createCategory);
categoryRoutes.get("/", controller.listCategories);
