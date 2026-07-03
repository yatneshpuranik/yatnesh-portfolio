const express = require('express');
const router = express.Router();
const { createMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');
const { messageValidator } = require('../validators');

// Public contact submission
router.post('/contact', messageValidator, createMessage);

// Admin messages management
router.route('/')
  .get(protect, getMessages);

router.route('/:id')
  .delete(protect, deleteMessage);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
