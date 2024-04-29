require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const celebrate = require('celebrate');

// Importing models like a boss
const Settings = require('../models/Settings');
const Organization = require('../models/Organization');
const Project = require('../models/Project');
const Question = require('../models/Question');
const Interviewee = require('../models/Interviewee');
const Response = require('../models/Response');
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

//Settings Routes
app.get('/api/settings', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized access. Please login.' });
  }
  try {
    const settings = await Settings.findOne({ userId: req.session.userId });
    if (!settings) {
      // If no settings found, return defaults
      return res.send({ emailNotifications: false, darkMode: false });
    }
    res.send(settings);
  } catch (error) {
    console.error(`Error fetching settings: ${error}`);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  }
});

app.post('/api/settings', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    emailNotifications: celebrate.Joi.boolean().required(),
    darkMode: celebrate.Joi.boolean().required(),
  }),
}), async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized access. Please login.' });
  }
  try {
    const settings = await Settings.findOneAndUpdate({ userId: req.session.userId }, req.body, { new: true, upsert: true });
    res.send(settings);
  } catch (error) {
    console.error(`Error updating settings: ${error}`);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  }
});

// Here comes the new shiny routes
// Create Organization
app.post('/organizations', async (req, res) => {
  try {
    const organization = new Organization(req.body);
    await organization.save();
    res.status(201).send(organization);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

// Create Project
app.post('/api/projects', async (req, res) => {
  let { organizationName, name } = req.body;

  if (!organizationName || !name) {
    return res.status(400).send({ message: "Missing required fields. Try actually filling out the form next time." });
  }

  // Normalize the organization name to improve consistency
  organizationName = organizationName.trim().toLowerCase();

  try {
    // Check if the organization exists, if not, create it
    let organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      organization = new Organization({ name: organizationName });
      await organization.save();
    }

    // Now that we have an organization, either found or created, proceed with project creation
    const project = new Project({
      organizationId: organization._id, // Use the found or newly created organization's ID
      name
    });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send({ message: "Failed to create project due to an unforeseen server hiccup.", error: error.toString() });
  }
});

// Add Question
app.post('/questions', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

// Register Interviewee
app.post('/interviewees', async (req, res) => {
  try {
    const interviewee = new Interviewee(req.body);
    await interviewee.save();
    res.status(201).send(interviewee);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

// Record Response
app.post('/responses', async (req, res) => {
  try {
    const response = new Response(req.body);
    await response.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

// The rest of your existing routes remain unchanged
app.get('/api/userinfo', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized access. Please login.' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }
    res.send({ firstName: user.firstName });
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

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}.`)))
  .catch(err => console.error(`Database connection error: ${err}`));

app.get('/dashboard.html', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/login.html'); // Redirect to login if not authenticated
  } else {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
  }
});

authController.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/dashboard.html'); // Redirect to the actual dashboard HTML page
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