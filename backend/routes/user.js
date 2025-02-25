const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Item = require("../model/Item");

// 🔹 Add Recyclable Item
router.post("/add-item", async (req, res) => {
  try {
    const { userId, type, quantity, scheduledDate, lat, long } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newItem = new Item({ user: userId, type, quantity, scheduledDate  ,location: { lat, long }});
    await newItem.save();

    user.items.push(newItem._id);
    await user.save();

    res.json({ message: "Item added successfully", newItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding item", error: err.message });
  }
});

// 🔹 View User's Items
router.get("/items/:userId", async (req, res) => {
  try {
    const items = await Item.find({ user: req.params.userId }).populate(
      "assignedMiddleman"
    );
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: err.message });
  }
});

module.exports = router;
