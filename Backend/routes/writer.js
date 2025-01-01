const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, JPEG, and PNG files are allowed."));
    }
  },
});

// Register a new writer
router.post("/register", upload.array("attachments", 2), async (req, res) => {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const attachments = req.files.map((file) => file.path);

    const newWriter = new Writer({
      fullName,
      email,
      phone,
      countryCode,
      password: hashedPassword,
      expertise,
      qualifications,
      experience,
      attachments,
      isApproved: false, // Explicitly set to false for pending status
    });

    await newWriter.save();
    res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error saving writer:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists." });
    } else {
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  }
});

// Writer login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const writer = await Writer.findOne({ email });

    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    if (!writer.isApproved) {
      return res.status(403).json({ message: "Your application has not been approved yet." });
    }

    const isPasswordValid = await bcrypt.compare(password, writer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate token
    const token = jwt.sign(
      { id: writer._id, email: writer.email, role: "expert" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: writer._id,
        email: writer.email,
        fullName: writer.fullName,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// Fetch writer metrics (with fullName)
router.get("/metrics/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const writer = await Writer.findOne({ email, isApproved: true });

    if (!writer) {
      return res.status(404).json({ message: "Writer not found or not approved." });
    }

    res.status(200).json({
      fullName: writer.fullName,
      tasksInProgress: writer.tasksInProgress || 0,
      questionsAnswered: writer.questionsAnswered || 0,
      reviews: writer.reviews || 0,
      onTimeDelivery: writer.onTimeDelivery || 100, // default to 100 if not available
      cancelledTasks: writer.cancelledTasks || 0,
    });
  } catch (error) {
    console.error("Error fetching writer metrics:", error);
    res.status(500).json({ message: "Failed to fetch writer metrics." });
  }
});

// Fetch all approved writers
router.get("/approved", async (req, res) => {
  try {
    const approvedWriters = await Writer.find({ isApproved: true });

    const writersWithAttachments = approvedWriters.map((writer) => ({
      ...writer._doc,
      attachments: writer.attachments.map(
        (path) => `${req.protocol}://${req.get("host")}/uploads/${path.split("/").pop()}`
      ),
    }));

    res.status(200).json(writersWithAttachments);
  } catch (error) {
    console.error("Error fetching approved writers:", error);
    res.status(500).json({ message: "Failed to fetch approved writers." });
  }
});

module.exports = router;
