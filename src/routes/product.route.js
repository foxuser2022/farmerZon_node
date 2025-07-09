import express from "express";
const router = express.Router();
import { addProduct, buyProductList, getCategories, getOrders, getSellerProducts, placeOrder } from "../controllers/product.controller.js";
import { verifySeller } from "../middleware/seller.middleware.js";
import { verifyBuyer } from "../middleware/buyer.middleware.js";

;

router.post("/", verifySeller, addProduct);
router.get("/my-products", verifySeller, getSellerProducts);
router.get("/categories", getCategories);
router.get("/:category/buy", buyProductList);

router.post("/order", verifyBuyer, placeOrder);
router.get("/orders", verifyBuyer, getOrders);


export default router; 