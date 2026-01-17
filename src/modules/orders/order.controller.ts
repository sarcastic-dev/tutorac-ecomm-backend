import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as orderService from "./order.service";
import { prisma } from "../../config/db";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { address } = req.body;

  if (
    !address?.line1 ||
    !address?.city ||
    !address?.state ||
    !address?.pincode ||
    !address?.country
  ) {
    throw new Error("Valid address is required");
  }

  const order = await orderService.checkout(req.user!.userId, address);
  res.status(201).json(order);
};

export const listMyOrders = async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  res.json(orders);
};
