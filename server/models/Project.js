const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  files: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
