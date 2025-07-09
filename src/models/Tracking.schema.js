import mongoose, { Schema } from "mongoose";

const TrackingSchema = new Schema({
  trackingNumber: { type: String, required: true, index: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: {
    type: String, enum: [
      'Pending',
      'Confirmed',
      'Shipped',
      'Nearest',
      'Delivered',
      'Cancelled',
      'Returned',
      'Failed'
    ],
    required: true
  },
  updatedAt: { type: Date, default: Date.now },
  note: { type: String },
});

const Tracking = mongoose.model("Tracking", TrackingSchema);
export default Tracking; 