const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/user"); // Import user routes
const writerRoutes = require("./routes/writer"); // Import writer routes
const adminRoutes = require("./routes/admin"); // Import admin routes

const app = express(); // Initialize Express application

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });

// Routes
app.use("/api/users", userRoutes); // Mount user routes at /api/users
app.use("/api/writers", writerRoutes); // Mount writer routes at /api/writers
app.use("/api/admin", adminRoutes); // Mount admin routes at /api/admin

// Test Route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
