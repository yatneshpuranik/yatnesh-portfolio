const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { loginValidator } = require('../validators');

router.post('/loginreq', loginValidator, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
