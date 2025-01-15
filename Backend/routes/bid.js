const express = require("express");
const mongoose = require("mongoose");
const Bid = require("../models/Bid");

const router = express.Router();

/**
 * Route to fetch all bids for a specific project
 * Method: GET
 * URL: /api/bids/:projectId
 * Params: projectId
 */
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  // Validate the projectId format
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid Project ID format." });
  }

  try {
    // Fetch bids for the given projectId directly from the Bid collection
    const bids = await Bid.find({ projectId }).lean();

    // If no bids are found, return a message
    if (!bids.length) {
      return res.status(404).json({ message: "No bids found for this project." });
    }

    // Return all bid details as is
    res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids for project:", error);
    res.status(500).json({ error: "Failed to fetch bids for the project." });
  }
});


/**
 * Route to place or update a bid
 * Method: POST
 * URL: /api/bids/
 * Request Body: { projectId, writerId, price, fullName, questionsAnswered, reviews, onTimeDelivery }
 */
router.post("/", async (req, res) => {
  const { projectId, writerId, price, fullName, questionsAnswered, reviews, onTimeDelivery } = req.body;

  // Validate required fields
  if (!projectId || !writerId || !price || !fullName) {
    return res.status(400).json({ error: "Project ID, Writer ID, Full Name, and Price are required." });
  }

  // Validate ObjectId format for projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid Project ID format." });
  }

  try {
    // Create or update a bid
    const bid = await Bid.findOneAndUpdate(
      { projectId, writerId }, // Search for an existing bid by projectId and writerId
      { projectId, writerId, fullName, price, questionsAnswered, reviews, onTimeDelivery }, // Update or set new values
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options for update/insert
    );

    res.status(201).json({ message: "Bid placed successfully!", bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "An error occurred while placing the bid." });
  }
});



/**
 * Route to delete bids for a specific project
 * Method: DELETE
 * URL: /api/bids/:projectId
 * Params: projectId
 */
router.delete("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  // Validate projectId format
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid Project ID format." });
  }

  try {
    const deletedBids = await Bid.deleteMany({ projectId });
    res.status(200).json({
      message: "All bids for the specified project were successfully deleted!",
      deletedCount: deletedBids.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting bids for project:", error);
    res.status(500).json({ error: "Failed to delete bids for the project." });
  }
});

module.exports = router;
