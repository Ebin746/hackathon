const mongoose = require("mongoose");
const ItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Item owner
  type: {
    type: String,
    required: true,
  },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    default: "Pending",
  },
  assignedMiddleman: { type: mongoose.Schema.Types.ObjectId, ref: "Middleman" }, // Assigned middleman
  ethValue: { type: Number, default: 0 }, // ETH allocated for this item
});

module.exports = mongoose.model("Item", ItemSchema);
