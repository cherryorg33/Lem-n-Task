import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../validators/user.validator";
import { z } from "zod";
import { error } from "node:console";

// ---------------- Register ----------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      id: user._id,
      email: user.email,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", err });
  }
};

// ---------------- Login ----------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    res.json({
      id: user._id,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Profile ----------------
export const getProfile = async (
  req: Request & { user?: any },
  res: Response
) => {
  const user = req.user;
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    id: user._id,
    email: user.email,
  });
};

// ---------------- Logout ----------------
export const logoutUser = async (_req: Request, res: Response) => {
  res.json({ message: "Logout successful" });
};
