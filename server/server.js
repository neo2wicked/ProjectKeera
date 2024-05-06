require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const celebrate = require('celebrate');
const multer = require('multer');
const { Joi } = require('celebrate');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

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
const ProjectDetail = require('../userinfo/ProjectDetails');

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

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204));

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
app.post('/api/projects', upload.single('companyLogo'), async (req, res) => {
    console.log("Received fields:", req.body);  // Log all received fields to see what's actually coming through

    let { organizationName, projectName } = req.body;

    if (!organizationName || !projectName) {
        console.log("Missing fields:", req.body);  // Log what was received if there's an error
        return res.status(400).send({ message: "Missing required fields. Try actually filling out the form next time.", receivedFields: req.body });
    }

    organizationName = organizationName.trim().toLowerCase();

    try {
        let organization = await Organization.findOne({ name: organizationName });
        if (!organization) {
            organization = new Organization({ name: organizationName });
            await organization.save();
        }

        const project = new Project({
            organizationId: organization._id,
            name: projectName
        });
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).send({ message: "Failed to create project due to an unforeseen server hiccup.", error: error.toString() });
    }
});

// Fetch Project Details
app.get('/api/projects/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        res.send(project);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.toString() });
    }
});

// Update or Create Project
app.post('/api/projects', upload.single('companyLogo'), async (req, res) => {
    const { projectId } = req.body;
    if (projectId) {
        // Update existing project
        try {
            const project = await Project.findByIdAndUpdate(projectId, req.body, { new: true });
            res.status(200).send(project);
        } catch (error) {
            console.error("Error updating project:", error);
            res.status(500).send({ message: "Failed to update project due to server error.", error: error.toString() });
        }
    } else {
        // Create new project
        try {
            const newProject = new Project(req.body);
            await newProject.save();
            res.status(201).send(newProject);
        } catch (error) {
            console.error("Error creating new project:", error);
            res.status(500).send({ message: "Failed to create new project due to server error.", error: error.toString() });
        }
    }
});

// Delete Project
app.delete('/api/projects/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        res.send({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete project', error: error.toString() });
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

// Handle POST request for project details
app.post('/api/projectDetails', celebrate({
    body: Joi.object().keys({
        details: Joi.string().required(),
        projectId: Joi.string().required(),
        interviewRounds: Joi.string().required(), // Validating as a string, assuming you parse it later
        video: Joi.any() // Validation for file uploads is tricky; handle as needed
    })
}), upload.single('video'), async (req, res) => {
    try {
        const projectDetailsData = {
            details: req.body.details,
            projectId: req.body.projectId,
            interviewRounds: JSON.parse(req.body.interviewRounds)
        };

        if (req.file) {
            projectDetailsData.coverVideo = req.file.path;
        }

        const projectDetails = new ProjectDetail(projectDetailsData);
        await projectDetails.save();
        res.status(201).send({ message: "Project details saved successfully!", projectDetails });
    } catch (error) {
        console.error("Error saving project details:", error);
        res.status(500).send({ message: "Failed to save project details.", error: error.toString() });
    }
});
