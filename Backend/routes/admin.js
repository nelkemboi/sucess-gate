const express = require("express");
const Writer = require("../models/Writer");

const router = express.Router();

// Fetch all pending applications
router.get("/writers/pending", async (req, res) => {
  try {
    const pendingWriters = await Writer.find({ isApproved: false });
    res.status(200).json(pendingWriters);
  } catch (error) {
    console.error("Error fetching pending writers:", error);
    res.status(500).json({ message: "Failed to fetch pending applications." });
  }
});

// Approve a writer application
router.put("/writers/approve/:id", async (req, res) => {
  try {
    const writerId = req.params.id;
    const writer = await Writer.findByIdAndUpdate(writerId, { isApproved: true }, { new: true });

    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    res.status(200).json({ message: "Writer approved successfully." });
  } catch (error) {
    console.error("Error approving writer:", error);
    res.status(500).json({ message: "Failed to approve writer." });
  }
});

// Reject a writer application
router.delete("/writers/reject/:id", async (req, res) => {
  try {
    const writerId = req.params.id;
    const writer = await Writer.findByIdAndDelete(writerId);

    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    res.status(200).json({ message: "Writer rejected successfully." });
  } catch (error) {
    console.error("Error rejecting writer:", error);
    res.status(500).json({ message: "Failed to reject writer." });
  }
});

module.exports = router;
