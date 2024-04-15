const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  intervieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interviewee', required: true },
  text: { type: String, required: true }
});

module.exports = mongoose.model('Response', responseSchema);