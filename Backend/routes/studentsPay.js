const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Payment = require("../models/StudentPay");
const Task = require("../models/Task");

/**
 * Process a payment and create/update task
 * Method: POST
 * URL: /api/payment/process
 * Request Body: { projectId, writerId, userId, paymentMethod, amount, deadline }
 */
router.post("/process", async (req, res) => {
  const { projectId, writerId, userId, paymentMethod, amount, deadline } = req.body;

  // Validate required fields
  if (!projectId || !writerId || !userId || !paymentMethod || !amount || !deadline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validate that projectId and writerId are valid ObjectIds
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(writerId)) {
    return res.status(400).json({ error: "Invalid Project or Writer ID format." });
  }

  try {
    // Create a new payment record
    const payment = await Payment.create({
      projectId,
      writerId,
      paymentMethod,
      amount,
      status: "completed", // Assume payment is successful
      paidAt: new Date(),
    });

    // Create or update the task
    const task = await Task.findOneAndUpdate(
      { projectId, writerId, userId }, // Identify task by project, writer, and user
      {
        status: "in-progress",
        deadline: new Date(deadline),
        startedAt: new Date(),
      }, // Fields to update or create
      { new: true, upsert: true } // Create a new task if it doesn't exist
    );

    res.status(200).json({
      message: "Payment processed successfully and task created/updated",
      payment,
      task,
    });
  } catch (error) {
    console.error("Error processing payment and creating/updating task:", error);
    res.status(500).json({ error: "Failed to process payment and create/update task." });
  }
});

module.exports = router;
