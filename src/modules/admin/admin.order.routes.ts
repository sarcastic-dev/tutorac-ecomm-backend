import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./admin.order.controller";

export const adminOrderRoutes = Router();

adminOrderRoutes.use(requireAuth, requireAdmin);

adminOrderRoutes.get("/", asyncHandler(controller.listAllOrders));
adminOrderRoutes.put("/:id/status", asyncHandler(controller.updateOrderStatus));
