const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./userinfo/userModel'); // Adjust path as necessary

mongoose.connect('process.env.DB_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true });

async function updatePasswords() {
  const users = await User.find({}); // Fetch all users or adjust query to target specific users

  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await user.save();
    console.log(`Updated password for user: ${user.email}`);
  }

  mongoose.disconnect();
}

updatePasswords().catch(console.error);