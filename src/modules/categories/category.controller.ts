import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  const category = await prisma.category.create({
    data: { name, slug },
  });

  res.status(201).json(category);
};

export const listCategories = async (_: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};
