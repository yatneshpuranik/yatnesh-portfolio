const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Yatnesh Portfolio',
  },
  title: {
    type: String,
    default: 'Yatnesh | Software Engineer & Researcher',
  },
  tagline: {
    type: String,
    default: 'Building the future with code and research.',
  },
  aboutMe: {
    type: String,
    default: '',
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  contactEmail: {
    type: String,
    default: '',
  },
  seoTitle: {
    type: String,
    default: 'Yatnesh Portfolio',
  },
  seoDescription: {
    type: String,
    default: 'Production-ready full-stack portfolio & research paper repository.',
  },
  seoKeywords: {
    type: [String],
    default: ['Portfolio', 'Developer', 'Researcher'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema, 'settings');
