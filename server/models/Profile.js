const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    default: 'Yatnesh',
  },
  title: {
    type: String,
    default: 'Full Stack Engineer & Researcher',
  },
  subTitle: {
    type: String,
    default: 'Crafting premium digital experiences and publishing advanced computing research.',
  },
  bio: {
    type: String,
    default: 'Highly motivated software engineer focused on building robust, scalable applications.',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: 'India',
  },
}, { timestamps: true, collection: 'profile' });

module.exports = mongoose.model('Profile', ProfileSchema);
