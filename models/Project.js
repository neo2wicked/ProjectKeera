const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization ID is required. Because, you know, projects don’t just belong to the ether.']
  },
  name: {
    type: String,
    required: [true, 'Every project needs a name. Otherwise, how would you refer to it? "Hey, you!"?'],
    trim: true,
    maxlength: [100, 'Project name too long. Nobody wants to read a novel.']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    // Consider adding a validation here to ensure there's at least one question if that makes sense for your app
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false // Because maybe you don’t want to show this by default. It’s like not showing your age on a first date.
  }
});

module.exports = mongoose.model('Project', projectSchema);