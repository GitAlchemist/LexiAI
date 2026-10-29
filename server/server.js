require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const trackerRoutes = require('./routes/trackerRoutes');

const app = express();

// Enable CORS for Vercel deployment
app.use(cors({
  origin: '*',
  credentials: true
}));

// Increase body size limits for large document uploads/analysis
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root health check route (prevents "Cannot GET /" errors in browser checks)
app.get('/', (req, res) => {
  res.send('LexiAI Backend API is running successfully.');
});

// API Routes
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);
app.use('/api/tracker', trackerRoutes);

// Global Error Handler to catch crashes and prevent 502 Bad Gateway
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LexiAI Backend running on port ${PORT}`);
});