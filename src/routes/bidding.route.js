import express from 'express';
const router = express.Router();
import Bidding from '../models/Bidding.schema.js';
import { verifySeller } from '../middleware/seller.middleware.js';

// Create new bidding
router.post('/', verifySeller, async (req, res) => {
    try {
        const user_id = req.user.userId;
        const newBid = new Bidding({ ...req.body, createdBy: user_id });
        const savedBid = await newBid.save();
        res.json(savedBid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/seller', verifySeller, async (req, res) => {
    try {
        const user_id = req.user.userId;
        const biddings = await Bidding.find({ createdBy: user_id });
        res.json(biddings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all active biddings
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const biddings = await Bidding.find({ endDateTime: { $gt: now } });
        const formatted = biddings.map(b => ({
            ...b._doc,
            highestBid: b.bids.length ? Math.max(...b.bids.map(b => b.amount)) : b.startingPrice
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single bid
router.get('/:id', async (req, res) => {
    try {
        const bid = await Bidding.findById(req.params.id).populate('bids.user');
        if (!bid) return res.status(404).json({ error: 'Not found' });

        const highestBid = bid.bids.length
            ? Math.max(...bid.bids.map(b => b.amount))
            : bid.startingPrice;

        res.json({ ...bid._doc, highestBid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Place a bid
router.post('/:id/bid', async (req, res) => {
    try {
        const { amount, user } = req.body;
        const bid = await Bidding.findById(req.params.id);
        if (!bid) return res.status(404).json({ error: 'Not found' });

        const now = new Date();
        if (now > bid.endDateTime) {
            return res.status(400).json({ error: 'Bidding has ended' });
        }

        const currentHighest = bid.bids.length ? Math.max(...bid.bids.map(b => b.amount)) : bid.startingPrice;
        if (amount <= currentHighest) {
            return res.status(400).json({ error: 'Bid must be higher than current highest' });
        }

        bid.bids.push({ amount, user });
        await bid.save();
        res.json({ success: true, highestBid: amount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;