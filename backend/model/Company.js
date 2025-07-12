const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true }, // ETH Address (MetaMask)
  name: { type: String, required: true, default: "Recycling Company" },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  companyType: { 
    type: String, 
    enum: ['Recycling Plant', 'Waste Management', 'Climate Investor', 'Carbon Credit Company'],
    required: true 
  },
  ethBalance: { type: Number, default: 100 }, // ETH available for payouts
  processedItems: [{ type: String }], // Simple array of item IDs (strings)
  carbonCreditsEarned: { type: Number, default: 0 }, // Carbon credits accumulated
  totalInvestment: { type: Number, default: 0 }, // Total ETH invested in the platform
  isVerified: { type: Boolean, default: false }, // Company verification status
  location: {
    address: { type: String },
    city: { type: String },
    country: { type: String },
    lat: { type: Number },
    long: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Company", CompanySchema);