const express = require('express');
const router = express.Router();
const { getEducations, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { protect } = require('../middlewares/auth');
const { educationValidator } = require('../validators');

router.route('/')
  .get(getEducations)
  .post(protect, educationValidator, createEducation);

router.route('/:id')
  .put(protect, educationValidator, updateEducation)
  .delete(protect, deleteEducation);

module.exports = router;
