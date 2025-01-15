const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true 
  },
  writerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  userId: { 
    type: String, // User ID as String
    required: true 
  },
  projectType: { // Changed from title to projectType
    type: String, 
    required: true 
  },
  subjectArea: { 
    type: String, 
    required: true 
  },
  tutor: { 
    type: String, // Writer's Name
    required: true 
  },
  status: { 
    type: String, 
    enum: ["in-progress", "completed", "paid"], 
    default: "in-progress" 
  },
  startedAt: { 
    type: Date, 
    default: Date.now 
  },
  completedAt: { 
    type: Date, 
    default: null 
  },
  deadline: { 
    type: Date, 
    required: true 
  },
});

module.exports = mongoose.model("Task", TaskSchema);
