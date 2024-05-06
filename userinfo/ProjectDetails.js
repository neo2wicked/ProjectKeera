const mongoose = require('mongoose');

const interviewRoundSchema = new mongoose.Schema({
    summary: {
        type: String,
        required: [true, 'Summary is required']
    },
    questions: {
        type: String,
        required: [true, 'Questions are required']
    },
    startDate: {
        type: Date,
        validate: [validateDate, 'Please enter a valid start date']
    },
    endDate: {
        type: Date,
        validate: [validateDate, 'Please enter a valid end date']
    },
    contact: String,
    video: String, // Assuming you're storing a reference to a video file, adjust as necessary
}, { timestamps: true });

const projectDetailSchema = new mongoose.Schema({
    details: String, // Assuming 'details' is a simple text field
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project' // Assuming it references a 'Project' model
    },
    interviewRounds: [interviewRoundSchema], // Array of interview rounds
    goalStatement: String,
    startDate: Date,
    stakeholdersSummary: String,
    changeImpacts: String,
    coverVideo: String, // Optional cover video for the project
}, { timestamps: true });

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = ProjectDetail;