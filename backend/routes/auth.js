const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Middleman = require("../model/Middleman");

//  Signup (User or Middleman)
router.post("/signup", async (req, res) => {
  try {
    const { walletAddress, name, phone, role } = req.body;
    if (role === "user") {
      const newUser = new User({ walletAddress, name, phone });
      await newUser.save();
      return res.json({ message: "User created successfully", newUser });
    } else if (role === "middleman") {
      const newMiddleman = new Middleman({ walletAddress, name, phone });
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

// 🔹 Login (Mock - Only Checks Wallet Address)
router.post("/login", async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const user = await User.findOne({ walletAddress });
    const middleman = await Middleman.findOne({ walletAddress });

    if (user) return res.json({ message: "User logged in", user });
    if (middleman)
      return res.json({ message: "Middleman logged in", middleman });

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

module.exports = router;
