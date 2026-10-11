const jwt = require('jsonwebtoken');

// Secret key for signing tokens
const JWT_SECRET = process.env.JWT_SECRET || 'lexiai_super_secret_jwt_key_2026';

// Register User / Workspace
exports.register = async (req, res) => {
  try {
    const { name, email, password, jurisdiction } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, jurisdiction: jurisdiction || 'India (Personal, Civil & Labor Laws)' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Workspace created successfully',
      token,
      user: { name, email, jurisdiction }
    });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password, jurisdiction } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const token = jwt.sign(
      { email, jurisdiction: jurisdiction || 'India (Personal, Civil & Labor Laws)' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Sign in successful',
      token,
      user: { email, jurisdiction }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};