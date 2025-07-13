import { Router } from 'express';
import authRouter from './auth.route.js';
import productRouter from './product.route.js';
import orderRouter from './order.route.js';
import userRouter from './user.route.js';
import paymentRouter from './payment.route.js';
import biddingRouter from './bidding.route.js';
import messageRouter from './message.route.js';

const router = Router();


router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/user', userRouter);
router.use('/payment', paymentRouter);
router.use('/bidding', biddingRouter);
router.use('/messages', messageRouter);

export default router; 