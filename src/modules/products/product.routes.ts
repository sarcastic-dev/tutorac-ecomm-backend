import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import * as controller from "./product.controller";

export const productRoutes = Router();

// Public
productRoutes.get("/", controller.listProducts);
productRoutes.get("/:id", controller.getProductById);

// Admin
productRoutes.post("/", requireAuth, requireAdmin, controller.createProduct);
