const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  text: { type: String, required: true },
  targetAudience: { type: String, enum: ['manager', 'project team', 'employees'], required: true }
});

module.exports = mongoose.model('Question', questionSchema);