const express = require('express');
const router = express.Router();
const { getExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { protect } = require('../middlewares/auth');
const { experienceValidator } = require('../validators');

router.route('/')
  .get(getExperiences)
  .post(protect, experienceValidator, createExperience);

router.route('/:id')
  .put(protect, experienceValidator, updateExperience)
  .delete(protect, deleteExperience);

module.exports = router;
