const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Middleman = require("../model/Middleman");

// 🔹 Signup (User or Middleman)
router.post("/signup", async (req, res) => {
  try {
    const { walletAddress, name, phone, role, password } = req.body;

    if (!walletAddress || !name || !phone || !role || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "user") {
      const existingUser = await User.findOne({ walletAddress });
      if (existingUser) {
        return res.status(400).json({ message: "Wallet address already exists" });
      }

      const newUser = new User({ walletAddress, name, phone, password });
      await newUser.save();
      return res.json({ message: "User created successfully", newUser });
    } else if (role === "middleman") {
      const existingMiddleman = await Middleman.findOne({ walletAddress });
      if (existingMiddleman) {
        return res.status(400).json({ message: "Wallet address already exists" });
      }

      const newMiddleman = new Middleman({ walletAddress, name, phone, password });
      await newMiddleman.save();
      return res.json({
        message: "Middleman created successfully",
        newMiddleman,
      });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
});

// 🔹 Login (Checks Wallet Address & Password)
router.post("/login", async (req, res) => {
  try {
    const { walletAddress, password } = req.body;

    if (!walletAddress || !password) {
      return res.status(400).json({ message: "Wallet address and password required" });
    }

    const user = await User.findOne({ walletAddress });
    const middleman = await Middleman.findOne({ walletAddress });

    if (user) {
      if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      return res.json({ message: "User logged in", user });
    }

    if (middleman) {
      if (middleman.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      return res.json({ message: "Middleman logged in", middleman });
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

module.exports = router;
