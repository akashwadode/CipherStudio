const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();
const app = express();

// ====== MIDDLEWARES ======
app.use(express.json());

// ✅ Allow your frontend domains (adjust if needed)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://cipherstudio-frontend.netlify.app", // 🔥 replace this with your deployed frontend URL
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ====== DATABASE CONNECTION ======
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('🔥 MongoDB Connected!'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// ====== ROUTES ======

// ✅ Root route (for Render test)
app.get('/', (req, res) => {
  res.send('🚀 CipherStudio Backend is live!');
});

// ✅ Health check (for Render uptime monitor)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ✅ Create or update a project
app.post('/api/projects', async (req, res) => {
  try {
    const { projectId, projectName, files } = req.body || {};
    if (!projectId || !files) {
      return res
        .status(400)
        .json({ error: 'projectId and files are required' });
    }

    const project = await Project.findOneAndUpdate(
      { projectId },
      { projectId, projectName, files },
      { upsert: true, new: true }
    );

    res.json({ success: true, project });
  } catch (error) {
    console.error('❌ Save Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get a project by ID
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectId: req.params.projectId,
    });
    res.json(project || null);
  } catch (error) {
    console.error('❌ Load Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
