const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Helper function to generate a unique userID
async function generateUniqueUserID() {
  let userID;
  let isUnique = false;

  while (!isUnique) {
    userID = `AS${Math.floor(100000 + Math.random() * 900000)}`; // Generate "AS" + 6 digits
    const existingUser = await User.findOne({ userID }); // Check for uniqueness in the database
    if (!existingUser) {
      isUnique = true;
    }
  }

  return userID;
}

// Register a User
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Generate a unique userID
    const userID = await generateUniqueUserID();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = new User({ fullName, email, password: hashedPassword, userID });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login a User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
