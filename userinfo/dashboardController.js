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
        // If the user is found, send user-specific data to the dashboard
        // Including the first name and email for a personalized greeting and account info
        res.json({
          firstName: user.firstName,
          email: user.email // Include the email in the response
        });
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
module.exports = dashboardController;