import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const listAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // SHIPPED | DELIVERED | CANCELLED

  if (!status) throw new Error("status is required");

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Order not found");

  // basic transition rules
  if (status === "SHIPPED" || status === "DELIVERED") {
    if (order.status !== "PAID" && order.status !== "SHIPPED") {
      throw new Error("Order must be PAID to update to this status");
    }
  }

  if (status === "CANCELLED" && order.status === "DELIVERED") {
    throw new Error("Cannot cancel delivered order");
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  res.json(updated);
};
