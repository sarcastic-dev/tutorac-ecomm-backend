import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./payment.controller";

export const paymentRoutes = Router();

paymentRoutes.use(requireAuth);

paymentRoutes.post("/initiate", asyncHandler(controller.initiate));
paymentRoutes.post("/confirm", asyncHandler(controller.confirm));
