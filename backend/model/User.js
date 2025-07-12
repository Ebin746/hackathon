const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String }, // ETH Address
  name: { type: String, required: true },
  phone: { type: String },
  password:{type:String},
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // User's recyclables
  ethEarned: { type: Number, default: 0 }, // Total ETH earned
});

module.exports = mongoose.model("User", UserSchema);
