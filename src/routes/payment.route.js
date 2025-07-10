import express from "express";
const router = express.Router();
import { createRazorpayOrder } from "../controllers/payment.controller.js";

router.post("/order", createRazorpayOrder);

export default router; 