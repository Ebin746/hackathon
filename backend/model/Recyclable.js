const recyclableSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
    type: { type: String },
    quantity: { type: Number}, // In kg or units
    status: { type: String, default: "Pending" },
    middleman: { type: mongoose.Schema.Types.ObjectId, ref: "Middleman" }, // Assigned collector
    price: { type: Number, }, // ETH to be rewarded
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Recyclable", recyclableSchema);
  