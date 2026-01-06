import { Request, Response } from "express";
import * as authService from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  const tokens = await authService.signup(req.body);
  res.status(201).json(tokens);
};

export const login = async (req: Request, res: Response) => {
  const tokens = await authService.login(req.body);
  res.json(tokens);
};
