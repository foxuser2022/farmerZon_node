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
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true },
  sellerName: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  sellerId: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  orderStatus: { type: String, default: 'Pending', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order; 