const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Middleman = require("../model/Middleman");

// 🔹 Signup (User or Middleman)
router.post("/signup", async (req, res) => {
  try {
    const { phone, name, role, password, walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "walletAddress is required" });
    }

    if (role === "user") {
      if (await User.findOne({ phone })) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      const newUser = new User({ phone, name, password, walletAddress });
      await newUser.save();
      return res.json({ message: "User created successfully", newUser });

    } else if (role === "middleman") {
      if (await Middleman.findOne({ phone })) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      const newMiddleman = new Middleman({ phone, name, password, walletAddress });
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
// 🔹 Login (Checks Phone)
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });
    const middleman = await Middleman.findOne({ phone });

    if (user) {
      return res.json({ message: "User logged in", user });
    }

    if (middleman) {
      return res.json({ message: "Middleman logged in", middleman });
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// 🔹 Get full details by ID
router.post("/get-details", async (req, res) => {
  try {
    const { id, role } = req.body;

    if (!id || !role) {
      return res.status(400).json({ message: "ID and role are required" });
    }

    if (role === "user") {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ user });
    } else if (role === "middleman") {
      const middleman = await Middleman.findById(id);
      if (!middleman) {
        return res.status(404).json({ message: "Middleman not found" });
      }
      return res.json({ middleman });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching details", error: err.message });
  }
});

module.exports = router;