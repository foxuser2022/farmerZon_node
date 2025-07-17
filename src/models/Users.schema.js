import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
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
const Users = mongoose.model("User", userSchema);

export default Users; 