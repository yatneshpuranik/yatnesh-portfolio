import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchExperiences, createExperience, updateExperience, deleteExperience } from '../services/api';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageExperiences = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Onsite');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [order, setOrder] = useState(0);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['admin-experiences-list'],
    queryFn: fetchExperiences,
  });

  const createMutation = useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-experiences-list']);
      toast.success('Experience created successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create experience');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExperience,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-experiences-list']);
      toast.success('Experience updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update experience');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-experiences-list']);
      toast.success('Experience deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete experience');
    },
  });

  const openAddModal = () => {
    setEditingExp(null);
    setCompany('');
    setRole('');
    setLocation('');
    setType('Onsite');
    setStartDate('');
    setEndDate('');
    setCurrentlyWorking(false);
    setDescription('');
    setTechnologies('');
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setLocation(exp.location || '');
    setType(exp.type || 'Onsite');
    setStartDate(exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '');
    setEndDate(exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '');
    setCurrentlyWorking(exp.currentlyWorking || false);
    setDescription(exp.description);
    setTechnologies(exp.technologies ? exp.technologies.join(', ') : '');
    setOrder(exp.order || 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExp(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!company || !role || !startDate || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      company,
      role,
      location,
      type,
      startDate,
      endDate: currentlyWorking ? null : endDate || null,
      currentlyWorking,
      description,
      technologies: techArray,
      order: parseInt(order) || 0,
    };

    if (editingExp) {
      updateMutation.mutate({ id: editingExp._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this experience record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage work history timeline records.</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experiences?.map((exp) => (
              <div key={exp._id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-md">{exp.role} at <span className="text-purple-500">{exp.company}</span></h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.currentlyWorking ? 'Present' : new Date(exp.endDate).toLocaleDateString()} | {exp.location} ({exp.type})
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-500 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {(!experiences || experiences.length === 0) && (
              <div className="py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                No experiences added yet. Click "Add Experience" to create one.
              </div>
            )}
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-950 p-6 md:p-8">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-150 dark:hover:bg-gray-850 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                {editingExp ? 'Edit Experience' : 'Add Experience Record'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="Tech Solutions Ltd"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Title *</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="Bangalore, India"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-white dark:bg-gray-950"
                    >
                      <option value="Onsite">Onsite</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={currentlyWorking}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Currently working checkbox */}
                <div className="pl-1">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentlyWorking}
                      onChange={(e) => setCurrentlyWorking(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 dark:border-gray-800 text-purple-600 bg-transparent focus:ring-purple-500 focus:ring-opacity-25"
                    />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">I am currently working in this role</span>
                  </label>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Technologies Used (comma separated)</label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="React, AWS, Node.js"
                  />
                </div>

                {/* Description (Rich text editor) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description * (Write HTML or simple format)</label>
                  <textarea
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="Describe your achievements and tasks in this role..."
                  />
                </div>

                {/* Submit Toolbar */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-850">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-855 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white text-xs font-semibold transition-colors"
                  >
                    Save Experience
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

export default ManageExperiences;
