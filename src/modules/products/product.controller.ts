import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, categoryId } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
    },
  });

  res.status(201).json(product);
};

export const listProducts = async (req: Request, res: Response) => {
  const { category, search } = req.query;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: category ? String(category) : undefined,
      name: search
        ? { contains: String(search), mode: "insensitive" }
        : undefined,
    },
    include: { category: true },
  });

  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};
