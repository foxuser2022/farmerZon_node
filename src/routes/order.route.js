import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { verifyBuyer } from "../middleware/buyer.middleware.js";
import { verifySeller } from "../middleware/seller.middleware.js";
import { getOrderRequests, getOrders, placeOrder } from "../controllers/product.controller.js";
import { updateOrderStatus, getTrackingInfo, updateTrackingStatus } from '../controllers/order.controller.js';
const router = express.Router();


router.post("/", verifyBuyer, placeOrder);
router.get("/all", verifyBuyer, getOrders);
router.get("/requests", verifySeller, getOrderRequests);

router.post('/:orderId/status', verifySeller, updateOrderStatus);  
router.get('/:orderId/tracking', verifyBuyer, getTrackingInfo);  
router.post('/:orderId/tracking', verifySeller, updateTrackingStatus);  

export default router; 