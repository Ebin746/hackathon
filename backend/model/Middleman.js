const mongoose = require("mongoose");

const MiddlemanSchema = new mongoose.Schema({
  walletAddress: { type: String}, // ETH Address
  name: { type: String, required: true },
  phone: { type: String },
  password:{type:String},
  assignedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // Items to pick up
  ethEarned: { type: Number, default: 0 }, // Total ETH earned
});

module.exports = mongoose.model("Middleman", MiddlemanSchema);
