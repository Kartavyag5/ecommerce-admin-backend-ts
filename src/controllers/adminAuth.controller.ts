import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/adminuser.model';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const registerAdmin = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await AdminUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await AdminUser.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: newAdmin.id, username, email },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminUser.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate Access Token
    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Send refreshToken in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      token: accessToken,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
      id: number;
      email: string;
    };
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

