import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "secret_api";

type dataTypes = {
  name?: string | undefined;
  username: string;
  email: string;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const signToken = (data: dataTypes): string => {
  return jwt.sign(data, JWT_SECRET);
};

export const verifyToken = (token: string): string | JwtPayload | null => {
  return jwt.verify(token, JWT_SECRET);
};
