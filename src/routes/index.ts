import { Router } from 'express';
import authRouter from './auth.route';
import productRouter from './product.route';
import userRouter from './user.route';

const router: Router = Router();

 
router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);


export default router;
