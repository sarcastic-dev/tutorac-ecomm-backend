import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { userRoutes } from "./modules/users/user.routes";
import { categoryRoutes } from "./modules/categories/category.routes";
import { productRoutes } from "./modules/products/product.routes";
import { inventoryRoutes } from "./modules/inventory/inventory.routes";
import { cartRoutes } from "./modules/cart/cart.routes";
import { orderRoutes } from "./modules/orders/order.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.use(errorMiddleware);
