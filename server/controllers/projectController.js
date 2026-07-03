const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, slug, summary, description, bannerImage, images, githubLink, liveLink, technologies, isFeatured, category, order } = req.body;

    const slugExists = await Project.findOne({ slug });
    if (slugExists) {
      res.status(400);
      throw new Error('Project slug must be unique');
    }

    const project = await Project.create({
      title,
      slug: slug.toLowerCase(),
      summary,
      description,
      bannerImage,
      images,
      githubLink,
      liveLink,
      technologies,
      isFeatured,
      category,
      order,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const { title, slug, summary, description, bannerImage, images, githubLink, liveLink, technologies, isFeatured, category, order } = req.body;

    if (slug && slug !== project.slug) {
      const slugExists = await Project.findOne({ slug });
      if (slugExists) {
        res.status(400);
        throw new Error('Project slug must be unique');
      }
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug: slug ? slug.toLowerCase() : project.slug,
        summary,
        description,
        bannerImage,
        images,
        githubLink,
        liveLink,
        technologies,
        isFeatured,
        category,
        order,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
