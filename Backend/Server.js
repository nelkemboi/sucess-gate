const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/user");
const writerRoutes = require("./routes/writer");
const adminRoutes = require("./routes/admin");
const projectRoutes = require("./routes/userProjects");
const bidRoutes = require("./routes/bid");
const paymentRoutes = require("./routes/studentsPay"); // Import payment routes
const taskRoutes = require("./routes/task"); // Import tasks routes

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    methods: ["GET", "POST"],
  },
});

// Attach WebSocket instance to the app for use in routes
app.set("io", io);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// WebSocket Integration
io.on("connection", (socket) => {
  console.log("A user connected via WebSocket.");

  // Join project-specific rooms
  socket.on("joinRoom", (projectId) => {
    socket.join(projectId);
    console.log(`User joined room: ${projectId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/writers", writerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/payment", paymentRoutes); // Add payment routes
app.use("/api/tasks", taskRoutes); // Add tasks routes

// Test Route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start the Server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
});
