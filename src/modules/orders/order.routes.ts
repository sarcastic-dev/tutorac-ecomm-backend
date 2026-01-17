import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./order.controller";

export const orderRoutes = Router();

orderRoutes.use(requireAuth);

orderRoutes.post("/", asyncHandler(controller.createOrder));
orderRoutes.get("/", asyncHandler(controller.listMyOrders));
