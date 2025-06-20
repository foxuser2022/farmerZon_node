import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.schema";
import Product from "../models/Product.schema";
import Category, { ICategory } from "../models/Category.schema";
import { Unit } from "../models/Product.schema";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "seller") {
      res.status(403).json({ message: "Access denied. Seller account is required." });
      return;
    }
    const { name, description, price, quantity, category, image, unit, location } = req.body;
    // Validate required fields
    if (!name || !description || !price || !quantity || !category || !unit || !location) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }
    if (!Object.values(Unit).includes(unit)) {
      res.status(400).json({ message: "Invalid unit." });
      return;
    }
    if (!location.city || !location.state || !location.address || !location.geolocation || !location.geolocation.lat || !location.geolocation.lng) {
      res.status(400).json({ message: "Incomplete location details." });
      return;
    }
    const imageUrl = image && image.trim() !== "" ? image : "https://static.vecteezy.com/system/resources/previews/017/603/114/non_2x/farm-products-round-design-template-thin-line-icon-concept-vector.jpg";
    const categoryDoc: ICategory | null = await Category.findOne({ name: category });
    if (!categoryDoc) {
      res.status(404).json({ message: "Unknown category" });
      return;
    }
    const product = new Product({
      name,
      description,
      price,
      quantity,
      unit,
      location,
      category: categoryDoc.id,
      image: imageUrl,
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
      res.status(403).json({ message: "Access denied. Seller account is required." });
      return;
    }
    const products = await Product.find({ seller: req.user.userId });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "seller") {
      res.status(403).json({ message: "Access denied. Seller account is required." });
      return;
    }
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
