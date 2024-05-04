const mongoose = require('mongoose');

const projectDetailSchema = new mongoose.Schema({
    details: String, // Assuming 'details' is a simple text field
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project' // Assuming it references a 'Project' model
    },
    // Add other fields as necessary, like timestamps, or specific attributes related to the project details
});

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = ProjectDetail;