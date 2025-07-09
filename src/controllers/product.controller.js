import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.schema.js";
import Product from "../models/Product.schema.js";
import Category from "../models/Category.schema.js";
import { Unit } from "../models/Product.schema.js";
import Order from "../models/Order.schema.js";

export const addProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      res
        .status(403)
        .json({ message: "Access denied. Seller account is required." });
      return;
    }
    const {
      name,
      description,
      price,
      quantity,
      category,
      image,
      unit,
      location,
    } = req.body;
    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !category ||
      !unit ||
      !location
    ) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }
    if (!Object.values(Unit).includes(unit)) {
      res.status(400).json({ message: "Invalid unit." });
      return;
    }
    if (
      !location.city ||
      !location.state ||
      !location.address ||
      !location.geolocation ||
      !location.geolocation.lat ||
      !location.geolocation.lng
    ) {
      res.status(400).json({ message: "Incomplete location details." });
      return;
    }
    const imageUrl =
      image && image.trim() !== ""
        ? image
        : "https://img2.tradewheel.com/uploads/blog/64eda10490638-attachment.jpg.webp";
    const categoryDoc = await Category.findOne({
      name: category,
    });
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
      category: categoryDoc.name,
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

export const getSellerProducts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      res
        .status(403)
        .json({ message: "Access denied. Seller account is required." });
      return;
    }
    const products = await Product.find({ seller: req.user.userId }).populate(
      "seller",
      "name"
    );
    res.status(200).json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const buyProductList = async (req, res) => {
  try {
    // Get query params
    const { category = "all", page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    // Get products with pagination and populate seller name
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate("seller", "name");

    res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get product list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    console.log("---------------place --order       >>>>");
    const userId = req.user.userId;
    const { items, total, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "No items in order." });
      return;
    }
    if (!paymentMethod) {
      res.status(400).json({ message: "Payment method required." });
      return;
    }
    // If multiple items, create separate orders for each
    const createdOrders = [];
    for (const item of items) {
      const product = await Product.findById(item._id).populate("seller");
      if (!product) {
        res.status(404).json({ message: `Product not found for item ${item._id}` });
        return;
      }
      let sellerName = "";
      let sellerPhone = "";
      let sellerId = '';
      if (
        product.seller &&
        typeof product.seller === "object" &&
        "name" in product.seller
      ) {
        const seller = product.seller;
        sellerName = String(seller.name);
        sellerPhone = seller.Phone && String(seller.Phone).trim() !== "" ? String(seller.Phone) : "N/A";
        sellerId = seller._id ? String(seller._id) : '';
      } else {
        sellerId = '';
      }
      const enrichedItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        units: product.unit,
        sellerName,
        sellerPhone,
        sellerId,
      };
      const order = await Order.create({
        user: userId,
        items: [enrichedItem],
        total: item.price * item.quantity, // total for this item only
        sellerName,
        sellerPhone,
        sellerId,
        paymentMethod,
        orderStatus: "Pending",
      });
      createdOrders.push(order);
    }
    res.status(201).json({ message: "Orders placed successfully", orders: createdOrders });
    return;
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Failed to place order" });
    return;
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Only return orders for this user, most recent first
    const [orders, totalOrders] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: userId })
    ]);
    const totalPages = Math.ceil(totalOrders / limit);
    res.status(200).json({ orders, totalOrders, page, totalPages });
    return;
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
    return;
  }
};

export const getOrderRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Only return orders for this user, most recent first
    const [orders, totalOrders] = await Promise.all([
      Order.find({ sellerId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: userId })
    ]);
    const totalPages = Math.ceil(totalOrders / limit);
    res.status(200).json({ orders, totalOrders, page, totalPages });
    return;
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
    return;
  }
};


