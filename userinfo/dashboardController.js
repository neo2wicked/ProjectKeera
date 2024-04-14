const path = require('path');
const User = require('./userModel'); // Assuming userModel.js is in the same directory. Adjust the path as necessary.

const dashboardController = async (req, res) => {
  if (!req.session.userId) {
    // If the user is not logged in, redirect to the login page
    res.redirect('/');
  } else {
    try {
      // Find the user by their session userId
      const user = await User.findById(req.session.userId);
      if (user) {
        // If the user is found, send the dashboard HTML file
        // You might want to send user-specific data to the dashboard here
        res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
      } else {
        // If the user is not found, possibly because the session userId is invalid
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error("Dashboard disaster:", error); // Upgraded to console.error because we're fancy
      res.status(500).send('Error accessing the dashboard, please try again.');
    }
  }
};
module.exports = dashboardController;