import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchSkills, createSkill, updateSkill, deleteSkill } from '../services/api';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSkills = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState(80);
  const [category, setCategory] = useState('Frontend');
  const [icon, setIcon] = useState('Code');
  const [order, setOrder] = useState(0);

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin-skills-list'],
    queryFn: fetchSkills,
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-skills-list']);
      toast.success('Skill added successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-skills-list']);
      toast.success('Skill updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update skill');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-skills-list']);
      toast.success('Skill deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete skill');
    },
  });

  const openAddModal = () => {
    setEditingSkill(null);
    setName('');
    setProficiency(80);
    setCategory('Frontend');
    setIcon('Code');
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setProficiency(skill.proficiency);
    setCategory(skill.category);
    setIcon(skill.icon || 'Code');
    setOrder(skill.order || 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !category) {
      toast.error('Skill name and category are required');
      return;
    }

    const payload = {
      name,
      proficiency: parseInt(proficiency) || 0,
      category,
      icon,
      order: parseInt(order) || 0,
    };

    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage technical skills and categorization.</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Skill Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Proficiency</th>
                  <th className="px-6 py-4">Icon Name</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-medium">
                {skills?.map((skill) => (
                  <tr key={skill._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/10">
                    <td className="px-6 py-4 font-bold">{skill.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-purple-600/5 text-purple-500 border border-purple-500/10">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="font-mono text-xs">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{skill.icon}</td>
                    <td className="px-6 py-4 text-center font-mono">{skill.order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-500 text-gray-400 hover:text-purple-500 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="p-1 rounded-lg border border-red-500/20 hover:bg-red-550/10 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {(!skills || skills.length === 0) && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500 italic">
                      No skills added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-950 p-6 md:p-8">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-150 dark:hover:bg-gray-850 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                {editingSkill ? 'Edit Skill Details' : 'Add New Skill'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skill Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                    placeholder="React, TypeScript"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-950"
                  >
                    <option value="Programming Languages">Programming Languages</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Databases">Databases</option>
                    <option value="CSE Fundamentals">CSE Fundamentals</option>
                    <option value="Tools & Platforms">Tools & Platforms</option>
                    <option value="Currently Learning">Currently Exploring (Current Learning)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Lucide Icon Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lucide Icon Name</label>
                    <input
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent font-mono"
                      placeholder="Code, Terminal, Database"
                    />
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
                </div>

                {/* Proficiency */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span>Proficiency *</span>
                    <span className="font-mono text-purple-500">{proficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
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
                    Save Skill
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

export default ManageSkills;
