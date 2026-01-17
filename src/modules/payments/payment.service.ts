import { prisma } from "../../config/db";
import { PaymentStatus } from "../../generated/prisma/client";

export const initiatePayment = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Not your order");
  if (order.status !== "PENDING") throw new Error("Order not payable");

  // check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment && existingPayment.status === "SUCCESS") {
    throw new Error("Order already paid");
  }

  const payment = await prisma.payment.upsert({
    where: { orderId },
    update: {},
    create: {
      orderId,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING,
      paymentReference: `MOCK-${Date.now()}`,
    },
  });

  // In real world you’d return gateway URL / token here
  return payment;
};

export const confirmPayment = async (
  userId: string,
  orderId: string,
  success: boolean
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Not your order");

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { orderId },
    });

    if (!payment) throw new Error("Payment not initiated");

    if (success) {
      const updatedPayment = await tx.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.SUCCESS },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      return updatedPayment;
    } else {
      return tx.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.FAILED },
      });
    }
  });
};
