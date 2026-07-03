const mongoose = require('mongoose');

const ResearchPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    default: [],
  },
  journal: {
    type: String,
    default: '',
  },
  volume: {
    type: String,
    default: '',
  },
  pages: {
    type: String,
    default: '',
  },
  year: {
    type: Number,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  externalLink: {
    type: String,
    default: '',
  },
  // Extended Research Showcase Fields
  problemStatement: {
    type: String,
    default: '',
  },
  methodology: {
    type: String,
    default: '',
  },
  architecture: {
    type: String,
    default: '',
  },
  results: {
    type: String,
    default: '',
  },
  conclusion: {
    type: String,
    default: '',
  },
  citation: {
    type: String,
    default: '',
  },
  presentedAt: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema, 'researchPapers');
