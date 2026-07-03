const express = require('express');
const router = express.Router();
const { getResearchPapers, getResearchPaperById, getResearchPaperBySlug, createResearchPaper, updateResearchPaper, deleteResearchPaper } = require('../controllers/researchController');
const { protect } = require('../middlewares/auth');
const { researchValidator } = require('../validators');

router.route('/')
  .get(getResearchPapers)
  .post(protect, researchValidator, createResearchPaper);

router.get('/slug/:slug', getResearchPaperBySlug);

router.route('/:id')
  .get(getResearchPaperById)
  .put(protect, researchValidator, updateResearchPaper)
  .delete(protect, deleteResearchPaper);

module.exports = router;
