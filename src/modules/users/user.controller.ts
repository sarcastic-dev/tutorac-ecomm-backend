import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(user);
};
