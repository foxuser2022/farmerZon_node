import express, { Router } from "express";
const router: Router = express.Router();
import { addProduct, buyProductList, getCategories, getSellerProducts } from "../controllers/product.controller";
import { verifySeller } from "../middleware/seller.middleware";

router.post("/", verifySeller, addProduct);
router.get("/my-products", verifySeller, getSellerProducts);
router.get("/categories", getCategories);
router.get("/:category/buy", buyProductList);


export default router;
