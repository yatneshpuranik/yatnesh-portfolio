const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');

// Public route for Yatnesh AI Chat Assistant
router.post('/', handleChat);

module.exports = router;
