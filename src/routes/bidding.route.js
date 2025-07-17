import express from 'express';
const router = express.Router();

import {
    createBid,
    getSellerBids,
    getActiveBids,
    getBidDetail,
    placeBid,
    deleteBid,
} from '../controllers/bidding.controller.js';

import { verifySeller } from '../middleware/seller.middleware.js';


router.post('/', verifySeller, createBid);
router.get('/seller', verifySeller, getSellerBids);
router.get('/active', getActiveBids);
router.get('/:id', getBidDetail);
router.post('/:id/bid', placeBid);
router.delete('/:id', verifySeller, deleteBid);

export default router;
