const express = require("express");
const router = express.Router();
const Middleman = require("../model/Middleman");
const Item = require("../model/Item");

// 🔹 View Available Items to Pick Up
router.get("/available-items", async (req, res) => {
    try {
      const groupedItems = await Item.aggregate([
        { $match: { status: "Pending" } }, // Only pending items
        { 
          $group: { 
            _id: "$user", // Group by user ID
            items: { $push: "$$ROOT" } // Push all items for the user
          } 
        },
        { 
          $lookup: { 
            from: "users", // Reference User collection
            localField: "_id", 
            foreignField: "_id",
            as: "userDetails"
          } 
        },
        { $unwind: "$userDetails" }, // Convert userDetails array into an object
        { 
          $project: { 
            _id: 0, // Hide _id
            userId: "$userDetails._id",
            userName: "$userDetails.name",
            userPhone: "$userDetails.phone",
            items: 1
          } 
        }
      ]);
  
      res.json(groupedItems);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching grouped items", error: err.message });
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

router.post("/assigned-items", async (req, res) => {
    try {
      // Assume the middleman's wallet address is sent in the request (e.g., via authentication middleware)
      const {id} = req.body;
    console.log("middleman assigned-itms")
      // Find the middleman by wallet address
      const middleman = await Middleman.findById(id);
  
      if (!middleman) {
        return res.status(404).json({ message: "Middleman not found" });
      }
  
      // Fetch items assigned to this middleman
      const assignedItems = await Item.find({ assignedMiddleman: middleman._id }).populate("user");
  
      // Return the assigned items
      res.json(assignedItems);
    } catch (err) {
      res.status(500).json({ message: "Error fetching assigned items", error: err.message });
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

router.post("/update-payment", async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    
    // Find the item by ID
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update the payment status to true
    item.paymentIsDone = true;
    await item.save();

    res.json({ message: "Payment status updated", item });
  } catch (err) {
    res.status(500).json({ message: "Error updating payment status", error: err.message });
  }
});
module.exports = router;
