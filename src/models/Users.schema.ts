import mongoose, { Model } from "mongoose";
import { IUser } from "../interfaces/IUser.interface";

// User schema
const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        Phone: { type: Number, required: true },
        role: {
            type: String,
            enum: ['seller', 'buyer'],
            default: 'buyer',
            required: true
        },
    },
    { timestamps: true }
);

// User model
const Users: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default Users;
