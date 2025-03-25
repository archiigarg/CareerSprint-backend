import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lcUsername: { type: String, required: false, default: null },
    courseraname: { type: String, required: false, default: null },
    linkedIn: { type: String, required: false, default: null },
    gfgUsername: { type: String, required: false, default: null },
}, {
    timestamps: true,
});

export const User = mongoose.model("User", userSchema, "users");
