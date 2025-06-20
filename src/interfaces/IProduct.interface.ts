import mongoose from "mongoose";
import { Unit } from "../models/Product.schema";

export interface ILocation {
  city: string;
  state: string;
  geolocation: {
    lat: number;
    lng: number;
  };
  address: string;
}

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: Unit;
  location: ILocation;
  category: mongoose.Schema.Types.ObjectId;
  image?: string;
  seller: mongoose.Schema.Types.ObjectId;
} 