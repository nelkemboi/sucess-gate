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
    // Fetch all bids for the project and populate writer details
    const bids = await Bid.find({ projectId })
      .populate("writerId", "fullName email expertise qualifications")
      .sort({ createdAt: -1 }); // Sort by creation date

    // If no bids are found, return a message
    if (!bids.length) {
      return res.status(404).json({ message: "No bids found for this project." });
    }

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
 * Request Body: { projectId, writerId, price, questionsAnswered, reviews, onTimeDelivery }
 */
router.post("/", async (req, res) => {
  const { projectId, writerId, price, questionsAnswered, reviews, onTimeDelivery } = req.body;

  // Validate required fields
  if (!projectId || !writerId || !price) {
    return res.status(400).json({ error: "Project ID, Writer ID, and Price are required." });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(writerId)) {
    return res.status(400).json({ error: "Invalid Project ID or Writer ID format." });
  }

  try {
    // Create or update a bid
    const bid = await Bid.findOneAndUpdate(
      { projectId, writerId },
      { projectId, writerId, price, questionsAnswered, reviews, onTimeDelivery },
      { new: true, upsert: true } // Create new if not found
    );

    res.status(201).json({ message: "Bid placed successfully!", bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "An error occurred while placing the bid." });
  }
});

/**
 * Route to delete a bid for a specific project
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
