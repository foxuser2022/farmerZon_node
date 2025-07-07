import express, { Router } from "express";
const router: Router = express.Router();
import { addProduct, buyProductList, getCategories, getOrders, getSellerProducts, placeOrder } from "../controllers/product.controller";
import { verifySeller } from "../middleware/seller.middleware";
import { verifyBuyer } from "../middleware/buyer.middleware";

;

router.post("/", verifySeller, addProduct);
router.get("/my-products", verifySeller, getSellerProducts);
router.get("/categories", getCategories);
router.get("/:category/buy", buyProductList);

router.post("/order", verifyBuyer, placeOrder);
router.get("/orders", verifyBuyer, getOrders);


export default router;
