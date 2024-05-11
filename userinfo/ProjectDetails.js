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
        // validate: [validateDate, 'Please enter a valid start date'] // TODO: Implement validateDate function or handle date validation appropriately.
    },
    endDate: {
        type: Date,
        // validate: [validateDate, 'Please enter a valid end date'] // TODO: Implement validateDate function or handle date validation appropriately.
    },
    contact: String,
    video: {
        type: String,
        default: null // Store the path to the video file or null if no video is uploaded
    }
}, { timestamps: true });

const projectDetailSchema = new mongoose.Schema({
    details: String,
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    interviewRounds: [interviewRoundSchema],
    goalStatement: String,
    startDate: Date,
    stakeholdersSummary: String,
    changeImpacts: String,
    coverVideo: {
        type: String,
        default: null // Optional cover video for the project
    }
}, { timestamps: true });

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = ProjectDetail;
module.exports = ProjectDetail;