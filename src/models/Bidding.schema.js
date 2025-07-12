import mongoose, { Schema } from "mongoose";

const bidSchema = new Schema({
    productTitle: String,
    productImage: String,
    description: String,
    startingPrice: Number,
    endDateTime: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    bids: [
        {
            amount: Number,
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Bidding = mongoose.model('Bidding', bidSchema);

export default Bidding;