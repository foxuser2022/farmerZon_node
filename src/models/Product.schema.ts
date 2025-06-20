import mongoose, { Model, Schema, Document } from "mongoose";
import { IProduct, ILocation } from "../interfaces/IProduct.interface";

export enum Unit {
  KG = "kg",
  LITRE = "litre",
  PIECE = "piece",
  GRAM = "gram",
  QUINTAL = "quintal",
  TON = "ton",
}

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: Object.values(Unit), required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String, required: true },
      geolocation: {
        lat: { type: String, required: true },
        lng: { type: String, required: true },
      },
    },
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
