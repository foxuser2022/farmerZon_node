import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.schema";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("----------add product");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
