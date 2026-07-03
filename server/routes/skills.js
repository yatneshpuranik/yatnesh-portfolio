const express = require('express');
const router = express.Router();
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middlewares/auth');
const { skillValidator } = require('../validators');

router.route('/')
  .get(getSkills)
  .post(protect, skillValidator, createSkill);

router.route('/:id')
  .put(protect, skillValidator, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
