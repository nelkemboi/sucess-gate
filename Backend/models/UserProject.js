const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userID: { type: String, required: true }, // User ID saved as a String
  projectTitle: { type: String, required: true },
  briefDescription: { type: String, required: true },
  projectType: { type: String, required: true },
  subjectArea: { type: String, required: true },
  deadline: { type: Date, required: true },
  autoMatch: { type: Boolean, default: false },
  pages: { type: Number, default: 1 }, // Number of pages
  attachments: [String], // Array of file paths
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
