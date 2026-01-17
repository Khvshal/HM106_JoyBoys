const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running!', timestamp: new Date() });
});

// Article submission endpoint
app.post('/api/articles/analyze', (req, res) => {
  const { title, content, url, source } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Generate mock credibility scores
  const sourceTrust = Math.floor(Math.random() * 40) + 60;
  const nlpScore = Math.floor(Math.random() * 40) + 50;
  const communityRating = Math.floor(Math.random() * 35) + 65;
  const crossSourceScore = Math.floor(Math.random() * 30) + 70;

  const overall = (sourceTrust + nlpScore + communityRating + crossSourceScore) / 4;

  res.json({
    success: true,
    analysis: {
      title,
      url,
      source,
      scores: {
        sourceTrust,
        nlpScore,
        communityRating,
        crossSourceScore,
        overall: Math.round(overall),
      },
      timestamp: new Date(),
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
