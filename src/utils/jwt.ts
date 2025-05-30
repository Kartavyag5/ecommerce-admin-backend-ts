import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};


// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     (req as any).admin = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };
