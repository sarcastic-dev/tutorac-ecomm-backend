import { Request, Response } from "express";
import { prisma } from "../../config/db";

/**
 * Admin: Set or update stock
 */
export const upsertInventory = async (req: Request, res: Response) => {
  const { productId, stockQuantity, lowStockThreshold } = req.body;

  const inventory = await prisma.inventory.upsert({
    where: { productId },
    update: {
      stockQuantity,
      lowStockThreshold,
    },
    create: {
      productId,
      stockQuantity,
      lowStockThreshold: lowStockThreshold ?? 5,
    },
  });

  res.json(inventory);
};

/**
 * Public/Admin: Get stock info
 */
export const getInventoryByProduct = async (req: Request, res: Response) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId: req.params.productId },
  });

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  res.json(inventory);
};
