import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as cartService from "./cart.service";

export const addItem = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;

  const item = await cartService.addToCart(
    req.user!.userId,
    productId,
    quantity
  );

  res.status(201).json(item);
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;

  const item = await cartService.updateCartItem(req.params.id, quantity);

  res.json(item);
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  await cartService.removeCartItem(req.params.id);
  res.status(204).send();
};

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await cartService.getUserCart(req.user!.userId);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  res.json({ items: cart, total });
};
