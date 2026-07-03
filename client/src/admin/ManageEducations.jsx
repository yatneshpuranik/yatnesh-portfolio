import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchEducations, createEducation, updateEducation, deleteEducation } from '../services/api';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageEducations = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);

  // Form states
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  const { data: educations, isLoading } = useQuery({
    queryKey: ['admin-educations-list'],
    queryFn: fetchEducations,
  });

  const createMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-educations-list']);
      toast.success('Education record added successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add education');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-educations-list']);
      toast.success('Education record updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update education');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-educations-list']);
      toast.success('Education record deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete education');
    },
  });

  const openAddModal = () => {
    setEditingEdu(null);
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartDate('');
    setEndDate('');
    setGrade('');
    setDescription('');
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy || '');
    setStartDate(edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '');
    setEndDate(edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '');
    setGrade(edu.grade || '');
    setDescription(edu.description || '');
    setOrder(edu.order || 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEdu(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!institution || !degree || !startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate: endDate || null,
      grade,
      description,
      order: parseInt(order) || 0,
    };

    if (editingEdu) {
      updateMutation.mutate({ id: editingEdu._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage academic qualifications and study records.</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {educations?.map((edu) => (
              <div key={edu._id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex justify-between items-start gap-4 font-sans">
                <div className="space-y-1">
                  <h3 className="font-bold text-md">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                  <h4 className="text-sm font-semibold text-purple-500">{edu.institution}</h4>
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'} {edu.grade ? `| Grade: ${edu.grade}` : ''}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-500 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id)}
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {(!educations || educations.length === 0) && (
              <div className="py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                No education records added yet. Click "Add Education" to create one.
              </div>
            )}
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-855 bg-white dark:bg-gray-955 p-6 md:p-8">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-150 dark:hover:bg-gray-850 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                {editingEdu ? 'Edit Education' : 'Add Education Record'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Institution */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Institution Name *</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="University of California"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Degree */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Degree *</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  {/* Field of Study */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    />
                  </div>

                  {/* Grade */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade (GPA/Score)</label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="3.8/4.0 or 92%"
                    />
                  </div>
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

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brief Description / Extra info</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="Relevant coursework, achievements, projects..."
                  />
                </div>

                {/* Submit Toolbar */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-855">
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
                    Save Education
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

export default ManageEducations;
