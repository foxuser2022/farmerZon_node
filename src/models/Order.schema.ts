import mongoose, { Model, Schema, Document } from "mongoose";

export interface IOrderItem {
  _id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
  units: string; // e.g., 'kg', 'piece', etc.
  sellerName: string;
  sellerPhone: string;
  sellerId: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  sellerName: string;
  sellerPhone: string;
  sellerId: string;
  paymentMethod: string;
  orderStatus: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
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

const OrderSchema = new Schema<IOrder>({
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

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default Order; 