const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

/**
 * Fetch active tasks for a user
 * Method: GET
 * URL: /api/tasks/active
 * Query Params: ?userId=<userId>
 */
router.get("/active", async (req, res) => {
  const { userId } = req.query;

  // Validate the presence of userId
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Fetch active tasks for the user
    const tasks = await Task.find({ userId, status: "in-progress" }) // No ObjectId validation for userId
      .populate("projectId", "title type deadline")
      .populate("writerId", "name");

    // Format tasks for frontend display
    const formattedTasks = tasks.map((task) => {
      const timeRemaining = Math.max(
        new Date(task.projectId?.deadline).getTime() - Date.now(),
        0
      );
      return {
        title: task.projectId?.title || "N/A",
        type: task.projectId?.type || "N/A",
        timeRemaining: timeRemaining > 0
          ? `${Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))} days`
          : "Expired",
        tutor: task.writerId?.name || "N/A",
        status: task.status,
      };
    });

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching active tasks:", error);
    res.status(500).json({ error: "Failed to fetch active tasks." });
  }
});

module.exports = router;
