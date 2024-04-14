require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const authController = require('../userinfo/authController');
const dashboardController = require('../userinfo/dashboardController');
const User = require('../userinfo/userModel');

const app = express();
const port = process.env.PORT || 3000;

const store = new MongoDBStore({
  uri: process.env.DB_CONNECTION_STRING,
  collection: 'sessions'
});

store.on('error', function(error) {
  console.error(`Session store error: ${error}`);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/userinfo', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized access. Please login.' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }
    res.send({ userName: user.email });
  } catch (error) {
    console.error(`Error fetching user info: ${error}`);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/dashboard', dashboardController);

app.post('/login', authController.login);

app.post('/signup', authController.signup);

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(`Session destruction error: ${err}`);
      return res.status(500).send('Error logging out. Please try again.');
    }
    res.redirect('/');
  });
});

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}.`)))
  .catch(err => console.error(`Database connection error: ${err}`));
