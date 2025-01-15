const mongoose = require("mongoose");

// Writer Schema
const writerSchema = new mongoose.Schema({
  writerId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId for consistency with MongoDB
    unique: true, // Ensures each writerId is unique
    required: true, // Makes it mandatory
    default: () => new mongoose.Types.ObjectId(), // Automatically generates an ObjectId
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  expertise: {
    type: String,
  },
  qualifications: {
    type: String,
  },
  experience: {
    type: String,
  },
  attachments: {
    type: [String],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  tasksInProgress: {
    type: Number,
    default: 0,
  },
  questionsAnswered: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  onTimeDelivery: {
    type: Number,
    default: 100,
  },
  cancelledTasks: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Writer", writerSchema);
