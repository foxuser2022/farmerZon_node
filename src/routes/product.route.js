import express from "express";
const router = express.Router();
import { addProduct, buyProductList, getCategories, getOrderRequests, getOrders, getSellerProducts, placeOrder } from "../controllers/product.controller.js";
import { verifySeller } from "../middleware/seller.middleware.js";


router.post("/", verifySeller, addProduct);
router.get("/my-products", verifySeller, getSellerProducts);
router.get("/categories", getCategories);
router.get("/:category/buy", buyProductList);

export default router; 