const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Middleman = require("../model/Middleman");

// 🔹 Signup (User or Middleman)
router.post("/signup", async (req, res) => {
  try {
    const { phone, name, role, password } = req.body;

console.log(phone,name,role,password)

    if (role === "user") {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      const newUser = new User({ phone, name, password });
      await newUser.save();
      return res.json({ message: "User created successfully", newUser });
    } else if (role === "middleman") {
      const existingMiddleman = await Middleman.findOne({ phone });
      if (existingMiddleman) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      const newMiddleman = new Middleman({ phone, name, password });
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

module.exports = router;