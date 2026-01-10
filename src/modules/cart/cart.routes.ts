import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import * as controller from "./cart.controller";

export const cartRoutes = Router();

cartRoutes.use(requireAuth);

cartRoutes.get("/", controller.getCart);
cartRoutes.post("/", controller.addItem);
cartRoutes.put("/:id", controller.updateItem);
cartRoutes.delete("/:id", controller.removeItem);
