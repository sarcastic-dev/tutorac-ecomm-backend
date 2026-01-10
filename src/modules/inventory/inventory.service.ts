import { prisma } from "../../config/db";

export const validateAndReduceStock = async (
  productId: string,
  quantity: number,
  tx = prisma
) => {
  const inventory = await tx.inventory.findUnique({
    where: { productId },
  });

  if (!inventory || inventory.stockQuantity < quantity) {
    throw new Error("Insufficient stock");
  }

  await tx.inventory.update({
    where: { productId },
    data: {
      stockQuantity: {
        decrement: quantity,
      },
    },
  });
};
