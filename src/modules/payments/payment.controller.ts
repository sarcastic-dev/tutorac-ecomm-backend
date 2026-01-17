import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as paymentService from "./payment.service";

export const initiate = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;
  if (!orderId) throw new Error("orderId is required");

  const payment = await paymentService.initiatePayment(
    req.user!.userId,
    orderId
  );

  res.status(201).json(payment);
};

export const confirm = async (req: AuthRequest, res: Response) => {
  const { orderId, success } = req.body;

  if (!orderId || typeof success !== "boolean") {
    throw new Error("orderId and success(boolean) are required");
  }

  const payment = await paymentService.confirmPayment(
    req.user!.userId,
    orderId,
    success
  );

  res.json(payment);
};
