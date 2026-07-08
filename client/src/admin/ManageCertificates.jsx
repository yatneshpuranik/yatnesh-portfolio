import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchCertificates, createCertificate, updateCertificate, deleteCertificate } from '../services/api';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Dropzone from '../components/UI/Dropzone';

const ManageCertificates = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState('');

  const { data: certificates, isLoading } = useQuery({
    queryKey: ['admin-certificates-list'],
    queryFn: fetchCertificates,
  });

  const createMutation = useMutation({
    mutationFn: createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-certificates-list']);
      toast.success('Certificate added successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add certificate');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-certificates-list']);
      toast.success('Certificate updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update certificate');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-certificates-list']);
      toast.success('Certificate deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete certificate');
    },
  });

  const openAddModal = () => {
    setEditingCert(null);
    setTitle('');
    setIssuer('');
    setIssueDate('');
    setCredentialUrl('');
    setOrder(0);
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '');
    setCredentialUrl(cert.credentialUrl || '');
    setOrder(cert.order || 0);
    setDescription(cert.description || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCert(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title || !issuer) {
      toast.error('Certificate title and issuer are required');
      return;
    }

    const payload = {
      title,
      issuer,
      issueDate: issueDate || null,
      credentialUrl,
      description,
      order: parseInt(order) || 0,
    };

    if (editingCert) {
      updateMutation.mutate({ id: editingCert._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage professional achievements and certifications.</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {certificates?.map((cert) => (
              <div key={cert._id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-950 dark:text-gray-100">{cert.title}</h3>
                  <p className="text-xs text-purple-500 font-semibold">{cert.issuer}</p>
                  {cert.issueDate && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-500 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert._id)}
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {(!certificates || certificates.length === 0) && (
              <div className="py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                No certificates added yet. Click "Add Certificate" to configure one.
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
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Certificate Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="IgniteX Research Participation"
                  />
                </div>

                {/* Issuer */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Issuer Organization *</label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="IgniteX / ICAT"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Issue Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Date</label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    />
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

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent h-20 resize-none"
                    placeholder="Demonstrates containerization concepts, building Docker images, etc."
                  />
                </div>

                {/* Credential URL / Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Credential Certificate Image *</label>
                  {credentialUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-white/[0.08] h-32 bg-gray-900 flex items-center justify-center">
                      <img src={credentialUrl} alt="Credential Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCredentialUrl('')}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Dropzone onUploadSuccess={setCredentialUrl} folder="Certificates" acceptType="image" />
                  )}
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
                    Save Certificate
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

export default ManageCertificates;
