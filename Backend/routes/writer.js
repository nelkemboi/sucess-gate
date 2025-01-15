const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Writer = require("../models/Writer");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../uploads");
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/x-python",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Supported types: PDF, Word, PowerPoint, Python, Text, Excel."
        )
      );
    }
  },
});

/**
 * @route POST /api/writers/register
 * @desc Register a new writer
 */
router.post("/register", upload.array("attachments", 5), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      countryCode,
      password,
      expertise,
      qualifications,
      experience,
    } = req.body;

    // Check if email already exists
    if (await Writer.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Process uploaded files
    const attachments = req.files.map((file) => file.filename);

    // Create new writer with writerId as ObjectId
    const newWriter = new Writer({
      writerId: new mongoose.Types.ObjectId(), // CHANGED: Generate a unique ObjectId for writerId
      fullName,
      email,
      phone,
      countryCode,
      password: hashedPassword,
      expertise,
      qualifications,
      experience,
      attachments,
      isApproved: false, // Set as pending by default
    });

    await newWriter.save();
    res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error saving writer:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate email detected." });
    }
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

/**
 * @route POST /api/writers/login
 * @desc Writer login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the writer by email
    const writer = await Writer.findOne({ email });

    // Check if writer exists
    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    // Check if the writer is approved
    if (!writer.isApproved) {
      return res.status(403).json({
        message: "Your application has not been approved yet.",
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, writer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token with writerId
    const token = jwt.sign(
      {
        id: writer.writerId?.toString(), // Use writerId if available
        email: writer.email,
        role: "expert",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and user details
    res.status(200).json({
      token,
      user: {
        writerId: writer.writerId, // Explicitly include writerId
        email: writer.email,
        fullName: writer.fullName,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

/**
 * @route GET /api/writers/metrics
 * @desc Fetch writer metrics using authorization token
 */
router.get("/metrics", async (req, res) => {
  try {
    // Extract token from authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required." });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const writerId = decoded.id;

    // Find writer using writerId
    const writer = await Writer.findOne({ writerId });
    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    // Return writer metrics
    res.status(200).json({
      id: writer.writerId,
      fullName: writer.fullName,
      email: writer.email,
      tasksInProgress: writer.tasksInProgress || 0,
      questionsAnswered: writer.questionsAnswered || 0,
      reviews: writer.reviews || 0,
      onTimeDelivery: writer.onTimeDelivery || 100,
      cancelledTasks: writer.cancelledTasks || 0,
      expertise: writer.expertise,
      qualifications: writer.qualifications,
    });
  } catch (error) {
    console.error("Error fetching writer metrics:", error.message);
    res.status(500).json({ message: "Failed to fetch writer metrics." });
  }
});

/**
 * @route GET /api/writers/metrics/:email
 * @desc Fetch writer metrics by email
 */
router.get("/metrics/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Validate email parameter
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find writer by email
    const writer = await Writer.findOne({ email, isApproved: true });
    if (!writer) {
      return res.status(404).json({ message: "Writer not found or not approved." });
    }

    // Return writer metrics
    res.status(200).json({
      id: writer.writerId,
      fullName: writer.fullName,
      email: writer.email,
      tasksInProgress: writer.tasksInProgress || 0,
      questionsAnswered: writer.questionsAnswered || 0,
      reviews: writer.reviews || 0,
      onTimeDelivery: writer.onTimeDelivery || 100,
      cancelledTasks: writer.cancelledTasks || 0,
      expertise: writer.expertise,
      qualifications: writer.qualifications,
    });
  } catch (error) {
    console.error("Error fetching writer metrics:", error.message);
    res.status(500).json({ message: "Failed to fetch writer metrics." });
  }
});

module.exports = router;
