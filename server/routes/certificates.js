const express = require('express');
const router = express.Router();
const { getCertificates, createCertificate, updateCertificate, deleteCertificate } = require('../controllers/certificateController');
const { protect } = require('../middlewares/auth');
const { certificateValidator } = require('../validators');

router.route('/')
  .get(getCertificates)
  .post(protect, certificateValidator, createCertificate);

router.route('/:id')
  .put(protect, certificateValidator, updateCertificate)
  .delete(protect, deleteCertificate);

module.exports = router;
