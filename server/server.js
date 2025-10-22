const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🔥 MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes

// Create or update a project
app.post('/api/projects', async (req, res) => {
  try {
    const { projectId, files } = req.body || {};
    if (!projectId || !files) {
      return res.status(400).json({ error: 'projectId and files are required' });
    }

    const project = await Project.findOneAndUpdate(
      { projectId },
      { projectId, files },
      { upsert: true, new: true }
    );

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a project by ID
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    res.json(project || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
