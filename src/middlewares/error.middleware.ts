import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  const message = err?.message || "Internal Server Error";
  res.status(400).json({ message });
};
