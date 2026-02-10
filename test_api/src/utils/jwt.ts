import jwt from "jsonwebtoken";
import { Config_Url } from "../config/config";

const JWT_SECRET = Config_Url.JWT_SECRET || "your_secret";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
