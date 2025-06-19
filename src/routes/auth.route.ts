import express, { Router } from "express";
import { register, login } from "../controllers/auth.controller";
const router: Router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
