import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchProjects, createProject, updateProject, deleteProject } from '../services/api';
import { Plus, Edit2, Trash2, X, Globe, Github, Sparkles } from 'lucide-react';
import Dropzone from '../components/UI/Dropzone';
import toast from 'react-hot-toast';

const ManageProjects = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [images, setImages] = useState([]);
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [category, setCategory] = useState('Development');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects-list'],
    queryFn: fetchProjects,
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects-list']);
      toast.success('Project created successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects-list']);
      toast.success('Project updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects-list']);
      toast.success('Project deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    },
  });

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setDescription('');
    setBannerImage('');
    setImages([]);
    setGithubLink('');
    setLiveLink('');
    setTechnologies('');
    setCategory('Development');
    setIsFeatured(false);
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setSummary(proj.summary);
    setDescription(proj.description);
    setBannerImage(proj.bannerImage);
    setImages(proj.images || []);
    setGithubLink(proj.githubLink || '');
    setLiveLink(proj.liveLink || '');
    setTechnologies(proj.technologies ? proj.technologies.join(', ') : '');
    setCategory(proj.category || 'Development');
    setIsFeatured(proj.isFeatured || false);
    setOrder(proj.order || 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    // Auto generate slug if not editing
    if (!editingProject) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title || !slug || !summary || !description || !bannerImage) {
      toast.error('Please fill in all required fields');
      return;
    }

    const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title,
      slug: slug.toLowerCase(),
      summary,
      description,
      bannerImage,
      images,
      githubLink,
      liveLink,
      technologies: techArray,
      isFeatured,
      category,
      order: parseInt(order) || 0,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleGalleryAdd = (url) => {
    setImages((prev) => [...prev, url]);
  };

  const handleGalleryRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage, sort, and detail portfolio items.</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((proj) => (
              <div key={proj._id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                
                {/* Banner */}
                <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                  <img src={proj.bannerImage} alt={proj.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-white hover:text-purple-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-purple-500 uppercase tracking-widest">{proj.category}</span>
                    <h3 className="font-bold text-md truncate">{proj.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{proj.summary}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-150 dark:border-gray-850">
                    <span className="text-gray-400">Order: {proj.order}</span>
                    <div className="flex gap-2">
                      {proj.githubLink && <Github className="w-4 h-4 text-gray-400 hover:text-white" />}
                      {proj.liveLink && <Globe className="w-4 h-4 text-gray-400 hover:text-white" />}
                    </div>
                  </div>
                </div>

              </div>
            ))}

            {(!projects || projects.length === 0) && (
              <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                No projects added yet. Click "Add Project" to create one.
              </div>
            )}
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-950 p-6 md:p-8">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-150 dark:hover:bg-gray-850 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                      placeholder="E-Commerce API"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug URL *</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent font-mono"
                      placeholder="e-commerce-api"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-950"
                    >
                      <option value="Development">Development</option>
                      <option value="Research">Research</option>
                      <option value="Web App">Web App</option>
                      <option value="Open Source">Open Source</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                      min="0"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center h-full pt-6 pl-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-gray-300 dark:border-gray-800 text-purple-600 bg-transparent focus:ring-purple-500 focus:ring-opacity-25"
                      />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature Project</span>
                    </label>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Summary *</label>
                  <textarea
                    rows="2"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                    placeholder="Short 2-sentence description of the project"
                  />
                </div>

                {/* Banner Image Uploader */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Banner Image *</label>
                  {bannerImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-850 h-40 bg-gray-900">
                      <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Dropzone onUploadSuccess={setBannerImage} folder="Projects" acceptType="image" />
                  )}
                </div>

                {/* Gallery Images */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Gallery (Multiple)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-20 bg-gray-900">
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleGalleryRemove(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-650 text-white hover:bg-red-700 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Dropzone onUploadSuccess={handleGalleryAdd} folder="Projects" acceptType="image" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Github */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Github Repository Link</label>
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent font-mono"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  {/* Live Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Link</label>
                    <input
                      type="url"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent font-mono"
                      placeholder="https://myproject.com"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                    placeholder="React, Node.js, Express, MongoDB"
                  />
                </div>

                {/* Description (Markdown text field) */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detailed Description (Supports Markdown) *</label>
                  <textarea
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent font-mono"
                    placeholder="# E-Commerce API\n\n## Problem...\n\n## Architecture..."
                  />
                </div>

                {/* Submit Toolbar */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-850">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-850 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white text-xs font-semibold transition-colors"
                  >
                    Save Project
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageProjects;
