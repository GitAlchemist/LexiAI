const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register new user workspace
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
router.post('/login', authController.login);

module.exports = router;