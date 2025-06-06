import mongoose, { Document, Model } from "mongoose";

// User interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'seller' | 'buyer';
    createdAt: Date;
    updatedAt: Date;
}

// User schema
const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
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
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
