const mongoose = require('mongoose');

const intervieweeSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: false },
  email: { type: String, required: false },
  role: { type: String, enum: ['manager', 'project team', 'employee'], required: true },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }]
});

module.exports = mongoose.model('Interviewee', intervieweeSchema);