const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  milestone: { type: String, default: 'General' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  estimatedMinutes: { type: Number, default: 30 },
  aiBriefing: {
    contextSummary: String,
    keyDeliverables: [String],
    suggestedTools: [String],
    potentialPitfalls: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General Productivity' },
  aiAnalysis: {
    summary: String,
    suggestedPhases: [String],
    complexityScore: { type: Number, min: 1, max: 10 },
    cognitiveLoadScore: { type: Number, min: 1, max: 10 }
  },
  tasks: [TaskSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
