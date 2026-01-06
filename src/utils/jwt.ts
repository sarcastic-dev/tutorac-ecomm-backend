import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });

export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.jwtSecret);
