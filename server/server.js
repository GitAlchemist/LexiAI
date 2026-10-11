require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LexiAI Backend running on port ${PORT}`);
});
app.use('/api/tracker', require('./routes/trackerRoutes'));