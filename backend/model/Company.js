const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true }, // ETH Address
  name: { type: String, default: "Recycling Company" },
  ethBalance: { type: Number, default: 100 }, // ETH available for payouts
  processedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // Verified items received
});

module.exports = mongoose.model("Company", CompanySchema);
