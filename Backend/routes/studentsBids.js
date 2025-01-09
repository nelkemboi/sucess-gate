const express = require("express");
const mongoose = require("mongoose");
const Bid = require("../models/Bid");

const router = express.Router();

// Route to fetch all bids for a specific task (projectId)
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  // Validate the projectId format
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid Project ID format." });
  }

  try {
    // Fetch bids for the project and populate the writerId field with selected fields
    const bids = await Bid.find({ projectId })
      .populate("writerId", "fullName email expertise qualifications") // Populate writerId with specific fields
      .sort({ createdAt: -1 }); // Sort bids by creation date in descending order

    // Check if no bids are found
    if (!bids.length) {
      return res.status(404).json({ message: "No bids found for this task." });
    }

    // Clean up the response to handle cases where writerId is null or orphaned
    const cleanBids = bids.map(bid => ({
      ...bid._doc,
      writerId: bid.writerId || "Orphaned Reference", // Handle orphaned references
    }));

    // Return the cleaned bids
    return res.status(200).json(cleanBids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({ error: "Failed to fetch bids for the task." });
  }
});

module.exports = router;
