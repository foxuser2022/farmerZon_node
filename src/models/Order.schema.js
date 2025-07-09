import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  _id: { type: String, required: true }, // Product ID
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: String,
  units: { type: String, required: true },
  sellerName: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  sellerId: { type: String, required: true },
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true },
  sellerName: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  sellerId: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  address: { type: String, required: true },
  orderStatus: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Returned',
      'Failed'
    ],
    default: 'Pending',
    required: true
  },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date, default: null },
  deliveryPerson: { type: String },
  deliveryPhone: { type: String },
  vehicleNumber: { type: String },

}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
