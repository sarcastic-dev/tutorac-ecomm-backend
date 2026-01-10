import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import * as controller from "./inventory.controller";

export const inventoryRoutes = Router();

// Admin
inventoryRoutes.post(
  "/",
  requireAuth,
  requireAdmin,
  controller.upsertInventory
);

// Public/Admin
inventoryRoutes.get("/:productId", controller.getInventoryByProduct);
