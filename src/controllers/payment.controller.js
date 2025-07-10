import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
    const { total } = req.body;

    if (!total || total <= 0) {
        return res.status(400).json({ error: "Invalid total amount" });
    }

    const amountInPaise = Math.round(total * 100);

    try {
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        });

        return res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return res.status(500).json({ error: "Failed to create Razorpay order" });
    }
};
