import axios from 'axios';

// Public endpoints
export const fetchSettings = async () => {
  const { data } = await axios.get('/settings');
  return data.data;
};

export const fetchProfile = async () => {
  const { data } = await axios.get('/settings/profile');
  return data.data;
};

export const fetchProjects = async () => {
  const { data } = await axios.get('/projects');
  return data.data;
};

export const fetchProjectBySlug = async (slug) => {
  const { data } = await axios.get(`/projects/slug/${slug}`);
  return data.data;
};

export const fetchResearchPapers = async () => {
  const { data } = await axios.get('/research');
  return data.data;
};

export const fetchResearchPaperById = async (id) => {
  const { data } = await axios.get(`/research/${id}`);
  return data.data;
};

export const fetchResearchPaperBySlug = async (slug) => {
  const { data } = await axios.get(`/research/slug/${slug}`);
  return data.data;
};

export const fetchSkills = async () => {
  const { data } = await axios.get('/skills');
  return data.data;
};

export const fetchExperiences = async () => {
  const { data } = await axios.get('/experience');
  return data.data;
};

export const fetchEducations = async () => {
  const { data } = await axios.get('/education');
  return data.data;
};

export const fetchSocialLinks = async () => {
  const { data } = await axios.get('/socials');
  return data.data;
};

export const fetchResumes = async () => {
  const { data } = await axios.get('/settings/resume');
  return data.data;
};

export const submitContactMessage = async (messageData) => {
  const { data } = await axios.post('/contact', messageData);
  return data;
};

// Admin protected endpoints (token is attached automatically by AuthContext configuration)
export const updateSettings = async (settingsData) => {
  const { data } = await axios.put('/settings', settingsData);
  return data.data;
};

export const updateProfile = async (profileData) => {
  const { data } = await axios.put('/settings/profile', profileData);
  return data.data;
};

// Projects CRUD
export const createProject = async (projectData) => {
  const { data } = await axios.post('/projects', projectData);
  return data.data;
};

export const updateProject = async ({ id, data: projectData }) => {
  const { data } = await axios.put(`/projects/${id}`, projectData);
  return data.data;
};

export const deleteProject = async (id) => {
  const { data } = await axios.delete(`/projects/${id}`);
  return data;
};

// Research CRUD
export const createResearchPaper = async (paperData) => {
  const { data } = await axios.post('/research', paperData);
  return data.data;
};

export const updateResearchPaper = async ({ id, data: paperData }) => {
  const { data } = await axios.put(`/research/${id}`, paperData);
  return data.data;
};

export const deleteResearchPaper = async (id) => {
  const { data } = await axios.delete(`/research/${id}`);
  return data;
};

// Skills CRUD
export const createSkill = async (skillData) => {
  const { data } = await axios.post('/skills', skillData);
  return data.data;
};

export const updateSkill = async ({ id, data: skillData }) => {
  const { data } = await axios.put(`/skills/${id}`, skillData);
  return data.data;
};

export const deleteSkill = async (id) => {
  const { data } = await axios.delete(`/skills/${id}`);
  return data;
};

// Experience CRUD
export const createExperience = async (experienceData) => {
  const { data } = await axios.post('/experience', experienceData);
  return data.data;
};

export const updateExperience = async ({ id, data: experienceData }) => {
  const { data } = await axios.put(`/experience/${id}`, experienceData);
  return data.data;
};

export const deleteExperience = async (id) => {
  const { data } = await axios.delete(`/experience/${id}`);
  return data;
};

// Education CRUD
export const createEducation = async (educationData) => {
  const { data } = await axios.post('/education', educationData);
  return data.data;
};

export const updateEducation = async ({ id, data: educationData }) => {
  const { data } = await axios.put(`/education/${id}`, educationData);
  return data.data;
};

export const deleteEducation = async (id) => {
  const { data } = await axios.delete(`/education/${id}`);
  return data;
};

// Social links CRUD
export const createSocialLink = async (socialData) => {
  const { data } = await axios.post('/socials', socialData);
  return data.data;
};

export const updateSocialLink = async ({ id, data: socialData }) => {
  const { data } = await axios.put(`/socials/${id}`, socialData);
  return data.data;
};

export const deleteSocialLink = async (id) => {
  const { data } = await axios.delete(`/socials/${id}`);
  return data;
};

// Messages CRUD
export const fetchMessages = async () => {
  const { data } = await axios.get('/messages');
  return data.data;
};

export const markMessageRead = async (id) => {
  const { data } = await axios.put(`/messages/${id}/read`);
  return data.data;
};

export const deleteMessage = async (id) => {
  const { data } = await axios.delete(`/messages/${id}`);
  return data;
};

// Resume CRUD
export const addResume = async (resumeData) => {
  const { data } = await axios.post('/settings/resume', resumeData);
  return data.data;
};

export const setActiveResume = async (id) => {
  const { data } = await axios.put(`/settings/resume/${id}/active`);
  return data.data;
};

export const deleteResume = async (id) => {
  const { data } = await axios.delete(`/settings/resume/${id}`);
  return data;
};

// File Upload
export const uploadFile = async (formData, folderName = 'general') => {
  formData.append('folder', folderName);
  const { data } = await axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// Certificates CRUD
export const fetchCertificates = async () => {
  const { data } = await axios.get('/certificates');
  return data.data;
};

export const createCertificate = async (certificateData) => {
  const { data } = await axios.post('/certificates', certificateData);
  return data.data;
};

export const updateCertificate = async ({ id, data: certificateData }) => {
  const { data } = await axios.put(`/certificates/${id}`, certificateData);
  return data.data;
};

export const deleteCertificate = async (id) => {
  const { data } = await axios.delete(`/certificates/${id}`);
  return data;
};
