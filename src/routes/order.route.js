import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { verifyBuyer } from "../middleware/buyer.middleware.js";
import { verifySeller } from "../middleware/seller.middleware.js";
import { getOrderRequests, getOrders, placeOrder } from "../controllers/product.controller.js";
const router = express.Router();


router.post("/", verifyBuyer, placeOrder);
router.get("/all", verifyBuyer, getOrders);
router.get("/requests", verifySeller, getOrderRequests);

router.post("/status", login);
router.post("/track", register);

export default router; 