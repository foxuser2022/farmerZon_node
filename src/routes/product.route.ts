import express, { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { addProduct, buyProductList, getCategories, getSellerProducts } from "../controllers/product.controller";
import { verifySeller } from "../middleware/seller.middleware";
const router: Router = express.Router();

router.post("/", verifySeller, addProduct);
router.get("/my-products", verifySeller, getSellerProducts);
router.get("/categories", getCategories);
router.get("/:category/buy", buyProductList);


export default router;
