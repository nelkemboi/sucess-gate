const mongoose = require("mongoose");

// Bid Schema
const bidSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to the 'Project' model
      required: true,
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer", // Reference to the 'Writer' model
      required: true,
    },
    fullName: { 
      type: String, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
