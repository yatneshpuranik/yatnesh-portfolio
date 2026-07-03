const ResearchPaper = require('../models/ResearchPaper');

// @desc    Get all research papers
// @route   GET /api/research
// @access  Public
const getResearchPapers = async (req, res, next) => {
  try {
    const papers = await ResearchPaper.find().sort({ year: -1, createdAt: -1 });
    res.json({ success: true, count: papers.length, data: papers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get research paper by ID
// @route   GET /api/research/:id
// @access  Public
const getResearchPaperById = async (req, res, next) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id);
    if (!paper) {
      res.status(404);
      throw new Error('Research paper not found');
    }
    res.json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Get research paper by slug
// @route   GET /api/research/slug/:slug
// @access  Public
const getResearchPaperBySlug = async (req, res, next) => {
  try {
    const paper = await ResearchPaper.findOne({ slug: req.params.slug });
    if (!paper) {
      res.status(404);
      throw new Error('Research paper not found');
    }
    res.json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Create research paper
// @route   POST /api/research
// @access  Private
const createResearchPaper = async (req, res, next) => {
  try {
    const { 
      title, slug, abstract, authors, journal, volume, pages, year, pdfUrl, externalLink,
      problemStatement, methodology, architecture, results, conclusion, citation, presentedAt 
    } = req.body;

    const paper = await ResearchPaper.create({
      title,
      slug,
      abstract,
      authors,
      journal,
      volume,
      pages,
      year,
      pdfUrl,
      externalLink,
      problemStatement,
      methodology,
      architecture,
      results,
      conclusion,
      citation,
      presentedAt,
    });

    res.status(201).json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Update research paper
// @route   PUT /api/research/:id
// @access  Private
const updateResearchPaper = async (req, res, next) => {
  try {
    let paper = await ResearchPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Research paper not found');
    }

    const { 
      title, slug, abstract, authors, journal, volume, pages, year, pdfUrl, externalLink,
      problemStatement, methodology, architecture, results, conclusion, citation, presentedAt 
    } = req.body;

    paper = await ResearchPaper.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        abstract,
        authors,
        journal,
        volume,
        pages,
        year,
        pdfUrl,
        externalLink,
        problemStatement,
        methodology,
        architecture,
        results,
        conclusion,
        citation,
        presentedAt,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete research paper
// @route   DELETE /api/research/:id
// @access  Private
const deleteResearchPaper = async (req, res, next) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Research paper not found');
    }

    await ResearchPaper.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Research paper deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResearchPapers,
  getResearchPaperById,
  getResearchPaperBySlug,
  createResearchPaper,
  updateResearchPaper,
  deleteResearchPaper,
};
