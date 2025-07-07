import mongoose, { Model, Schema, Document } from "mongoose";

export interface IOrderItem {
  _id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  paymentMethod: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  _id: { type: String, required: true }, // Product ID
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: String,
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default Order; 