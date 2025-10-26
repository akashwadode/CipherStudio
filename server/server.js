const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();
const app = express();

// ====== CORS Configuration ======
const allowedOrigins = [
  'https://cozy-churros-0152e6.netlify.app', // your deployed frontend
  'http://localhost:5173', // local dev
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle preflight requests for all routes
app.options('/*', cors());

// ====== Middleware ======
app.use(express.json());

// ====== MongoDB Connection ======
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('🔥 MongoDB Connected!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ====== Routes ======

// Root route
app.get('/', (req, res) => {
  res.send('🚀 CipherStudio Backend is Live!');
});

// Health check route (optional)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create or update a project
app.post('/api/projects', async (req, res) => {
  try {
    const { projectId, projectName, files } = req.body;
    if (!projectId || !files) {
      return res.status(400).json({ error: 'projectId and files are required' });
    }

    const project = await Project.findOneAndUpdate(
      { projectId },
      { projectId, projectName, files },
      { upsert: true, new: true }
    );

    // ✅ Return project directly
    res.json(project);
  } catch (error) {
    console.error('❌ Save Error:', error);
    res.status(500).json({ error: '❌ Failed to save project' });
  }
});

// Get a project by ID
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

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
