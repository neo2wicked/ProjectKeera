const bcrypt = require('bcrypt');
const User = require('./userModel');

const authController = {};

// Signup function
authController.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Missing username, email, or password');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/');
  } catch (error) {
    console.error('Signup Error:', error);
    if (error.code === 11000) {
      res.status(409).send('Username or email already in use');
    } else {
      res.status(500).send('Error registering new user, please try again.');
    }
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
