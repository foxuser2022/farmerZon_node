import mongoose, { Model, Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: mongoose.Schema.Types.ObjectId;
  image?: string;
  seller: mongoose.Schema.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/017/603/114/non_2x/farm-products-round-design-template-thin-line-icon-concept-vector.jpg",
    },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
