const bcrypt = require('bcrypt');
const User = require('./userModel');

const authController = {};

// Signup function
authController.signup = async (req, res) => {
  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user
    const user = new User({
      email: req.body.email, // Goodbye username, hello email
      password: hashedPassword
    });
    // Save the user to the database
    await user.save();
    // Redirect to login page after signup
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error registering new user, please try again.');
  }
};

// Login function
authController.login = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email }); // We're all about emails now
    if (user) {
      // Compare the provided password with the stored hashed password
      if (await bcrypt.compare(req.body.password, user.password)) {
        // Store user information in session
        req.session.userId = user._id;
        // Redirect to dashboard after successful login
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect password');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error logging in, please try again.');
  }
};

module.exports = authController;
