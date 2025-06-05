const mongoose = require("mongoose");

const DashboardUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Manager"], default: "Manager" },
    approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("DashboardUser", DashboardUserSchema, "DashboardUser");
