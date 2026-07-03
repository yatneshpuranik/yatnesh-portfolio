import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../services/api';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSocials = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Link');
  const [order, setOrder] = useState(0);

  const { data: socials, isLoading } = useQuery({
    queryKey: ['admin-socials-list'],
    queryFn: fetchSocialLinks,
  });

  const createMutation = useMutation({
    mutationFn: createSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-socials-list']);
      toast.success('Social link added successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add link');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-socials-list']);
      toast.success('Social link updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update link');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-socials-list']);
      toast.success('Social link deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete link');
    },
  });

  const openAddModal = () => {
    setEditingLink(null);
    setName('');
    setUrl('');
    setIcon('Link');
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setName(link.name);
    setUrl(link.url);
    setIcon(link.icon || 'Link');
    setOrder(link.order || 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingLink(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !url) {
      toast.error('Platform name and URL are required');
      return;
    }

    const payload = {
      name,
      url,
      icon,
      order: parseInt(order) || 0,
    };

    if (editingLink) {
      updateMutation.mutate({ id: editingLink._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage public social platform links (GitHub, LinkedIn, Email etc.).</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socials?.map((link) => (
              <div key={link._id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm">{link.name}</h3>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 font-mono truncate hover:text-purple-500 block">
                    {link.url}
                  </a>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(link)}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-500 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {(!socials || socials.length === 0) && (
              <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                No social links configured.
              </div>
            )}
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-855 bg-white dark:bg-gray-955 p-6 md:p-8">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-150 dark:hover:bg-gray-850 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                {editingLink ? 'Edit Social Link' : 'Add Social Link'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Platform Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="Github, LinkedIn, Email"
                  />
                </div>

                {/* URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Link URL *</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent font-mono"
                    placeholder="https://github.com/your-username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Icon */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lucide Icon ID</label>
                    <input
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent font-mono"
                      placeholder="Github, Linkedin, Mail"
                    />
                  </div>

                  {/* Order */}
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
                    Save Link
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

export default ManageSocials;
