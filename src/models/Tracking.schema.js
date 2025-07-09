import mongoose, { Schema } from "mongoose";

const TrackingSchema = new Schema({
  trackingNumber: { type: String, required: true, index: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: {
    type: String, enum: [
      'Pending',
      'Confirmed',
      'Shipped',
      'Processing',
      'Nearest-Store',
      'In-your-area',
      'At-your-doorstep',
      'Delivered',
      'Cancelled',
      'Returned',
      'Failed'
    ],
    required: true
  },
  note: { type: String },
  deliveryPerson: { type: String },
  deliveryPhone: { type: String },
  vehicleNumber: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const Tracking = mongoose.model("Tracking", TrackingSchema);
export default Tracking; 