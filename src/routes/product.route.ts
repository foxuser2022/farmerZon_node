import express, { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { addProduct, getCategories, getSellerProducts } from "../controllers/product.controller";
import { verifySeller } from "../middleware/seller.middleware";
const router: Router = express.Router();

router.post("/", verifySeller, addProduct);
router.get("/my-products", verifySeller, getSellerProducts);
router.get("/categories", verifySeller, getCategories);


export default router;
