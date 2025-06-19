import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.schema";
import Product from "../models/Product.schema";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is seller
    if (!req.user || req.user.role !== "seller") {
      res.status(403).json({ message: "Access denied. Seller role required." });
      return;
    }
    const { name, description, price, quantity, category, image } = req.body;
    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      image,
      seller: req.user.userId,
    });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSellerProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "seller") {
      res.status(403).json({ message: "Access denied. Seller role required." });
      return;
    }
    const products = await Product.find({ seller: req.user.userId });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
