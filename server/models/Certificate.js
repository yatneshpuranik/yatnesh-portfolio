const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  issuer: {
    type: String,
    required: true,
    trim: true,
  },
  issueDate: {
    type: Date,
  },
  credentialUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true, collection: 'certificates' });

module.exports = mongoose.model('Certificate', CertificateSchema, 'certificates');
