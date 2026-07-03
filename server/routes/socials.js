const express = require('express');
const router = express.Router();
const { getSocials, createSocial, updateSocial, deleteSocial } = require('../controllers/socialController');
const { protect } = require('../middlewares/auth');
const { socialValidator } = require('../validators');

router.route('/')
  .get(getSocials)
  .post(protect, socialValidator, createSocial);

router.route('/:id')
  .put(protect, socialValidator, updateSocial)
  .delete(protect, deleteSocial);

module.exports = router;
