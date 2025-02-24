const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletAddress: { type: String}, // ETH Wallet
  name: { type: String },
  phone: { type: String },
  recyclables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recyclable" }],
  earnings: { type: Number, default: 0 }, // Total ETH earned
});

module.exports = mongoose.model("User", userSchema);
