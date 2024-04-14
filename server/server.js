require('dotenv').config(); // Finally, where it belongs. At the top, like a king.

const express = require('express');
// const bodyParser = require('body-parser'); // Let's leave this relic in the past where it belongs.
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const authController = require('../userinfo/authController');
const dashboardController = require('../userinfo/dashboardController');

const app = express();
const port = process.env.PORT || 3000; // Look at you, being all dynamic and flexible.

// MongoDB session store setup, now with 100% more environment variable loading action!
const store = new MongoDBStore({
  uri: process.env.DB_CONNECTION_STRING,
  collection: 'sessions'
});

// Catch errors, because they will happen. Oh, they will happen.
store.on('error', function(error) {
  console.error(`Store meltdown: ${error}`); // At least you're consistent with your error handling. I'll give you that.
});

// Middleware, because who doesn't like a little extra with their requests?
app.use(express.urlencoded({ extended: false })); // Welcome to the future.
app.use(express.json()); // JSON all the way, baby.

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Look at you, planning for contingencies.
  resave: false,
  saveUninitialized: false,
  store: store
}));

// Serve static files, because we're civilized people.
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Routes, because an app without routes is like a car without wheels.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/dashboard', dashboardController);

app.post('/login', authController.login);

app.post('/signup', authController.signup);

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(`Failed to destroy session: ${err}`); // Again, console.error, because we like to be proper.
    } else {
      res.redirect('/');
    }
  });
});

// Connect to MongoDB, now with the environment variable actually loaded before use.
mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}. Now with less deprecated options!`);
    });
  })
  .catch(err => console.error(`MongoDB threw a tantrum: ${err}`)); // Consistency is key, console.error for the win.
