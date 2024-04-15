const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  emailNotifications: {
    type: Boolean,
    default: false,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  // Placeholder for future settings
  // someOtherSetting: {
  //   type: String,
  //   default: '',
  // },
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;