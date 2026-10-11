const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');

router.post('/submit', trackerController.submitComplaint);
router.get('/all', trackerController.getComplaints);

module.exports = router;