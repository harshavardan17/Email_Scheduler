import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "email-scheduler-dev-secret";

export const signToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET) as { email?: string; sub?: string; iat?: number; exp?: number };
