import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "category",
  categorySchema,"category"
);

export default Category; 