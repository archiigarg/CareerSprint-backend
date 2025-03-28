import express from "express";
import authenticateFirebaseUser from "../middleware/googleAuth.js";
import { User } from "../models/userModel.js";

const routerUser = express.Router();

// Login or Register User
routerUser.post("/login", authenticateFirebaseUser, async (req, res) => {
    const { email, name, uid } = req.user;
    if (!email || !name || !uid) {
        return res.status(400).json({ message: "Email, name & uid are required" });
    }

    try {
        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({ uid, name, email });
            await user.save();
        }
        return res.status(200).json({
            message: "Logged in successfully",
            user: { uid: user.uid, email: user.email, name: user.name },
        });
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get User Details
routerUser.get("/", authenticateFirebaseUser, async (req, res) => {
    const { uid } = req.user;
    if (!uid) {
        return res.status(400).json({ message: "Uid is required" });
    }

    try {
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User retrieved successfully", user });
    } catch (err) {
        console.error("Error fetching user", err);
        return res.status(500).json({ message: "Server error" });
    }
});

routerUser.post("/attachLC", authenticateFirebaseUser, async (req, res) => {
    console.log("Request Body:", req.body);

    const { uid } = req.user;
    const { lcUsername, linkedIn, courseraName, gfgUsername } = req.body;

    if (!uid) {
        return res.status(400).json({ message: "Uid is required" });
    }

    const updateFields = {};
    if (lcUsername) updateFields.lcUsername = lcUsername;
    if (linkedIn) updateFields.linkedIn = linkedIn;
    if (courseraName) updateFields.courseraname = courseraName;
    if (gfgUsername) updateFields.gfgUsername = gfgUsername;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { uid },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Updated User:", updatedUser);

        return res.status(200).json({ message: "User details updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default routerUser;
