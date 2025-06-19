import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.schema";

export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' });
      return;
    }
    const user = await Users.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
