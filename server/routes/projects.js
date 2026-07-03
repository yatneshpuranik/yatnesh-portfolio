const express = require('express');
const router = express.Router();
const { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');
const { projectValidator } = require('../validators');

router.route('/')
  .get(getProjects)
  .post(protect, projectValidator, createProject);

router.route('/:id')
  .put(protect, projectValidator, updateProject)
  .delete(protect, deleteProject);

router.get('/slug/:slug', getProjectBySlug);

module.exports = router;
