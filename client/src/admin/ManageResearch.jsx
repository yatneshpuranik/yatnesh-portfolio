import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchResearchPapers, createResearchPaper, updateResearchPaper, deleteResearchPaper } from '../services/api';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import Dropzone from '../components/UI/Dropzone';
import toast from 'react-hot-toast';

const ManageResearch = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [volume, setVolume] = useState('');
  const [pages, setPages] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [pdfUrl, setPdfUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');

  const { data: papers, isLoading } = useQuery({
    queryKey: ['admin-papers-list'],
    queryFn: fetchResearchPapers,
  });

  const createMutation = useMutation({
    mutationFn: createResearchPaper,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-papers-list']);
      toast.success('Research paper publication added!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add research paper');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateResearchPaper,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-papers-list']);
      toast.success('Research paper publication updated!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update research paper');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResearchPaper,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-papers-list']);
      toast.success('Research paper deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete research paper');
    },
  });

  const openAddModal = () => {
    setEditingPaper(null);
    setTitle('');
    setAbstract('');
    setAuthors('');
    setJournal('');
    setVolume('');
    setPages('');
    setYear(new Date().getFullYear());
    setPdfUrl('');
    setExternalLink('');
    setModalOpen(true);
  };

  const openEditModal = (paper) => {
    setEditingPaper(paper);
    setTitle(paper.title);
    setAbstract(paper.abstract);
    setAuthors(paper.authors ? paper.authors.join(', ') : '');
    setJournal(paper.journal || '');
    setVolume(paper.volume || '');
    setPages(paper.pages || '');
    setYear(paper.year);
    setPdfUrl(paper.pdfUrl);
    setExternalLink(paper.externalLink || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPaper(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title || !abstract || !authors || !year || !pdfUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const authsArray = authors.split(',').map(a => a.trim()).filter(Boolean);
    const payload = {
      title,
      abstract,
      authors: authsArray,
      journal,
      volume,
      pages,
      year: parseInt(year) || new Date().getFullYear(),
      pdfUrl,
      externalLink,
    };

    if (editingPaper) {
      updateMutation.mutate({ id: editingPaper._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this publication record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Manage research paper publications and PDFs.</p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Publication
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {papers?.map((paper) => (
              <div key={paper._id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-md">{paper.title}</h3>
                  <p className="text-xs text-gray-500">
                    Authors: {paper.authors.join(', ')} | Year: {paper.year}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(paper)}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-500 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(paper._id)}
                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-555/10 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {(!papers || papers.length === 0) && (
              <div className="py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                No research paper publications added yet.
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
                {editingPaper ? 'Edit Publication' : 'Add Research Publication'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Paper Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="Machine Learning for Image Detection"
                  />
                </div>

                {/* Authors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Authors * (comma separated)</label>
                  <input
                    type="text"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="Yatnesh, Dr. Smith, Jane Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Journal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Journal/Conference Name</label>
                    <input
                      type="text"
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="IEEE Transactions"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Publication Year *</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Volume */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume / Issue</label>
                    <input
                      type="text"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="Vol 12, Issue 4"
                    />
                  </div>

                  {/* Pages */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Numbers</label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                      placeholder="145-156"
                    />
                  </div>
                </div>

                {/* PDF file uploader */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Paper PDF document *</label>
                  {pdfUrl ? (
                    <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate max-w-sm font-mono text-purple-600">{pdfUrl}</span>
                      <button
                        type="button"
                        onClick={() => setPdfUrl('')}
                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <Dropzone onUploadSuccess={setPdfUrl} folder="ResearchPaper" acceptType="pdf" />
                  )}
                </div>

                {/* External Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">External Publisher URL</label>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent font-mono"
                    placeholder="https://ieee.org/..."
                  />
                </div>

                {/* Abstract */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Abstract/Summary *</label>
                  <textarea
                    rows="4"
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-855 bg-transparent"
                    placeholder="Provide the abstract of the research paper..."
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
                    Save Publication
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

export default ManageResearch;
