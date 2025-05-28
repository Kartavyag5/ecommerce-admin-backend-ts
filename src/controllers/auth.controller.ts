import { Request, Response } from 'express';
import { AdminUser } from '../models';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user:any = await AdminUser.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token });
};
