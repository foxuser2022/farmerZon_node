import mongoose, { Document, Model } from "mongoose";
import { IUser } from "src/Interfaces/Iuser.Interface";



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


const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
