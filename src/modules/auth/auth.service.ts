import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { SignupDTO, LoginDTO } from "./auth.types";

export const signup = async (data: SignupDTO) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return issueTokens(user.id, user.role);
};

export const login = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(data.password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return issueTokens(user.id, user.role);
};

const issueTokens = (userId: string, role: string) => {
  const payload = { userId, role };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
