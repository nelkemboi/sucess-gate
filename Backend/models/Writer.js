const mongoose = require("mongoose");

const writerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  countryCode: String,
  password: { type: String, required: true },
  expertise: String,
  qualifications: String,
  experience: String,
  attachments: [String],
  isApproved: { type: Boolean, default: false },
  tasksInProgress: { type: Number, default: 0 },
  questionsAnswered: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  onTimeDelivery: { type: Number, default: 100 },
  cancelledTasks: { type: Number, default: 0 },
});

module.exports = mongoose.model("Writer", writerSchema);