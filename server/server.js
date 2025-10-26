const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();
const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'https://cozy-churros-0152e6.netlify.app', // your frontend domain
  'http://localhost:5173', // optional: for local dev
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options(/.*/, cors());

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('🔥 MongoDB Connected!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Routes
app.get('/', (req, res) => {
  res.send('🚀 CipherStudio Backend is Live!');
});

app.post('/api/projects', async (req, res) => {
  try {
    const { projectId, projectName, files } = req.body;
    const existing = await Project.findOne({ projectId });

    if (existing) {
      existing.projectName = projectName;
      existing.files = files;
      await existing.save();
      return res.json({ message: '✅ Project updated successfully' });
    }

    const newProject = new Project({ projectId, projectName, files });
    await newProject.save();
    res.json({ message: '✅ Project saved successfully' });
  } catch (error) {
    console.error('❌ Save Error:', error);
    res.status(500).json({ error: '❌ Failed to save project to DB' });
  }
});

app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ error: '❌ Project not found' });
    res.json(project);
  } catch (error) {
    console.error('❌ Load Error:', error);
    res.status(500).json({ error: '❌ Failed to load project' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
