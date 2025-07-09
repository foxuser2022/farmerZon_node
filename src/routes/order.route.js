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

router.post('/:orderId/status', verifySeller, updateOrderStatus); // update order status (with tracking if shipped)
router.get('/:orderId/tracking', verifyBuyer, getTrackingInfo); // get tracking info for user
router.post('/:orderId/tracking', verifySeller, updateTrackingStatus); // update tracking status/note

export default router; 