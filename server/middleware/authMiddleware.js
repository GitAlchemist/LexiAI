const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'lexiai_super_secret_jwt_key_2026'
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired authorization token.' });
  }
};