const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.getLegalAdvisory);
router.post('/analyze-contract', upload.single('document'), aiController.analyzeContract);
router.post('/generate-clause', aiController.generateCustomClause); // Added AI route

module.exports = router;