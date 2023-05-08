import { randomBytes, createHash } from "crypto";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const createJwtToken = (id: string) => {
  if (!process.env.JWT_SECRET) throw new TRPCError({ code: "NOT_FOUND", message: "Can't find JWT_SECRET environment variable" });
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const comparePassword = async (inputPassword: string, userPassword: string): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, userPassword);
};

export const generateHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const generateRandomToken = () => {
  const resetToken = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(resetToken).digest("hex");
  return {
    token: resetToken,
    hashedToken: hashedToken,
    expires: Date.now() + 10 * 60 * 1000,
  };
};

export const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};
