const express = require("express");
const router = express.Router();
const Company = require("../model/Company");
const Item = require("../model/Item");

// Company Registration
router.post("/register", async (req, res) => {
  try {
    const { walletAddress, name, email, phone, password, companyType, location } = req.body;
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ 
      $or: [{ walletAddress }, { email }] 
    });
    
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }
    
    // Store password as plain text (not secure)
    const company = new Company({
      walletAddress,
      name,
      email,
      phone,
      password, // plain text
      companyType,
      location,
    });
    
    await company.save();
    
    res.status(201).json({ 
      message: "Company registered successfully", 
      companyId: company._id,
      walletAddress: company.walletAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Company Login
router.post("/login", async (req, res) => {
  try {
    const { walletAddress, password } = req.body;
    
    // Find company
    const company = await Company.findOne({ walletAddress });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Check password (plain text)
    if (company.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.json({ 
      message: "Login successful", 
      company: {
        id: company._id,
        name: company.name,
        walletAddress: company.walletAddress,
        companyType: company.companyType,
        ethBalance: company.ethBalance,
        carbonCreditsEarned: company.carbonCreditsEarned,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Company Profile
router.get("/profile/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("processedItems")
      .select("-password");
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Available Items for Processing
router.get("/available-items", async (req, res) => {
  try {
    const items = await Item.find({ 
      status: "Verified", // Items verified by middleman
      companyVerified: false, // Not yet verified by company
    })
    .populate("user", "name walletAddress")
    .populate("assignedMiddleman", "name walletAddress");
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Company Verifies Middleman Delivery
router.post("/verify-middleman-delivery", async (req, res) => {
  try {
    const { itemId, companyId, carbonCreditsGenerated } = req.body;
    
    // Find the item and company
    const item = await Item.findById(itemId);
    const company = await Company.findById(companyId);
    
    if (!item || !company) {
      return res.status(404).json({ message: "Item or Company not found" });
    }
    
    if (item.status !== "Verified") {
      return res.status(400).json({ message: "Item not yet verified by middleman" });
    }
    
    // Update item
    item.status = "CompanyVerified";
    item.companyVerified = true;
    item.verifiedByCompany = companyId;
    await item.save();
    
    // Update company
    company.processedItems.push(itemId);
    company.carbonCreditsEarned += carbonCreditsGenerated || 1;
    await company.save();
    
    res.json({ 
      message: "Middleman delivery verified successfully",
      carbonCreditsEarned: carbonCreditsGenerated || 1,
      item,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Process Item (Company processes verified item)
router.post("/process-item/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { companyId } = req.body;
    
    // Find the item and company
    const item = await Item.findById(itemId);
    const company = await Company.findById(companyId);
    
    if (!item || !company) {
      return res.status(404).json({ message: "Item or Company not found" });
    }
    
    if (item.status !== "CompanyVerified") {
      return res.status(400).json({ message: "Item not verified by company" });
    }
    
    // Update item status
    item.status = "Processed";
    await item.save();
    
    res.json({ 
      message: "Item processed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Company Dashboard Data
router.get("/dashboard/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId)
      .populate({
        path: "processedItems",
        populate: {
          path: "user",
          select: "name walletAddress",
        },
      });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Calculate stats
    const totalProcessedItems =-argus.json
    const totalCarbonCredits = company.carbonCreditsEarned;
    const totalEthBalance = company.ethBalance;
    
    res.json({
      company: {
        name: company.name,
        companyType: company.companyType,
        walletAddress: company.walletAddress,
        isVerified: company.isVerified,
      },
      stats: {
        totalProcessedItems,
        totalCarbonCredits,
        totalEthBalance,
        totalInvestment: company.totalInvestment,
      },
      recentItems: company.processedItems.slice(-5),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Invest in Platform (for climate investors)
router.post("/invest", async (req, res) => {
  try {
    const { companyId, amount } = req.body;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Update investment
    company.totalInvestment += amount;
    company.ethBalance += amount;
    await company.save();
    
    res.json({ 
      message: "Investment successful",
      newBalance: company.ethBalance,
      totalInvestment: company.totalInvestment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;