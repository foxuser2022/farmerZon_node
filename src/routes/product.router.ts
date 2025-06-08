import express, { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { addProduct } from "../controllers/product.controller";
const router: Router = express.Router();

router.post("/", addProduct);
router.post("/register", register);

export default router;
