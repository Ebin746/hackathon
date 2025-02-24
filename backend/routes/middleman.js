const express = require("express");
const router = express.Router();
const Middleman = require("../model/Middleman");
const Item = require("../model/Item");

// 🔹 View Available Items to Pick Up
router.get("/available-items", async (req, res) => {
  try {
    const items = await Item.find({ status: "Pending" }).populate("user");
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: err.message });
  }
});

//  Assign Item to Middleman
router.post("/assign-item", async (req, res) => {
  try {
    const { middlemanId, itemId } = req.body;
    const middleman = await Middleman.findById(middlemanId);
    const item = await Item.findById(itemId);

    if (!middleman || !item)
      return res.status(404).json({ message: "Middleman or Item not found" });

    item.assignedMiddleman = middlemanId;
    item.status = "Picked Up";
    await item.save();

    middleman.assignedItems.push(itemId);
    await middleman.save();

    res.json({ message: "Item assigned to middleman", item });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error assigning item", error: err.message });
  }
});

//  Verify & Pay (Mock Response for Hackathon)
router.post("/verify-item", async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "Verified";
    item.ethValue = (Math.random() * 0.05).toFixed(4); // Assigning random ETH value
    await item.save();

    res.json({ message: "Item verified", item });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying item", error: err.message });
  }
});

module.exports = router;
