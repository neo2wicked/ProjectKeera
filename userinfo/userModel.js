const mongoose = require('mongoose');

// Define the schema for our user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: { // Changed from username to email
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // Removed the separate email field since we're consolidating
});

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);

module.exports = User;
