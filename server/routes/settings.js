const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getProfile,
  updateProfile,
  getResumes,
  addResume,
  setActiveResume,
  deleteResume,
} = require('../controllers/settingController');
const { protect } = require('../middlewares/auth');

// Site settings routes
router.route('/')
  .get(getSettings)
  .put(protect, updateSettings);

// Profile routes
router.route('/profile')
  .get(getProfile)
  .put(protect, updateProfile);

// Resume routes
router.route('/resume')
  .get(getResumes)
  .post(protect, addResume);

router.route('/resume/:id')
  .delete(protect, deleteResume);

router.route('/resume/:id/active')
  .put(protect, setActiveResume);

module.exports = router;
