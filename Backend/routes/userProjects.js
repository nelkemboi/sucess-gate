const express = require("express");
const multer = require("multer");
const Project = require("../models/UserProject");

const router = express.Router();

// WebSocket integration
let io; // To store the WebSocket instance
router.use((req, res, next) => {
  io = req.app.get("io");
  next();
});

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

// POST: Create a Project
router.post("/", upload.array("attachments"), async (req, res) => {
  try {
    const { userID, projectTitle, briefDescription, projectType, subjectArea, deadline, autoMatch, pages } = req.body;

    if (!userID || !projectTitle || !briefDescription || !projectType || !subjectArea || !deadline) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newProject = new Project({
      userID,
      projectTitle,
      briefDescription,
      projectType,
      subjectArea,
      deadline,
      autoMatch: autoMatch === "true", // Convert to boolean
      pages: parseInt(pages, 10), // Convert to number
      attachments: req.files.map((file) => file.path),
    });

    const savedProject = await newProject.save();

    // Emit a WebSocket event for the new project
    if (io) {
      io.emit("newProject", savedProject);
    }

    res.status(201).json({
      message: "Project created successfully.",
      projectId: savedProject._id, // Include projectId in the response
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project." });
  }
});

module.exports = router;
