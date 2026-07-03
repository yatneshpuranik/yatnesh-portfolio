import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchResumes, addResume, setActiveResume, deleteResume } from '../services/api';
import Dropzone from '../components/UI/Dropzone';
import { FileText, CheckCircle2, Trash2, Calendar, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageResume = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['admin-resumes-list'],
    queryFn: fetchResumes,
  });

  // Mutators
  const addMutation = useMutation({
    mutationFn: addResume,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resumes-list']);
      toast.success('Resume version added successfully!');
      setTitle('');
      setPdfUrl('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add resume');
    },
  });

  const setActiveMutation = useMutation({
    mutationFn: setActiveResume,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resumes-list']);
      toast.success('Active resume updated!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to set active version');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resumes-list']);
      toast.success('Resume version deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    },
  });

  const handleUploadSuccess = (url) => {
    setPdfUrl(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !pdfUrl) {
      toast.error('Please enter a title and upload the PDF file');
      return;
    }

    addMutation.mutate({
      title,
      url: pdfUrl,
      isActive: resumes && resumes.length === 0 ? true : false, // active by default if it's the first one
    });
  };

  const handleSetAgentActive = (id) => {
    setActiveMutation.mutate(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resume version?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        <p className="text-sm text-gray-500">Upload new PDF resumes and select the active version served to visitors.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Uploader Card */}
          <div className="lg:col-span-5 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19]">
            <h3 className="font-bold text-md mb-4">Upload New Version</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Yatnesh Resume 2026"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload PDF file *</label>
                <Dropzone onUploadSuccess={handleUploadSuccess} folder="Resume" acceptType="pdf" />
              </div>

              <button
                type="submit"
                disabled={addMutation.isPending || !pdfUrl}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors pt-3"
              >
                Add Version
              </button>
            </form>
          </div>

          {/* Versions List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-md">Resume Repository</h3>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes?.map((res) => (
                  <div key={res._id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 bg-white dark:bg-[#0b0f19] transition-colors
                    ${res.isActive 
                      ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/5' 
                      : 'border-gray-200 dark:border-gray-800'
                    }
                  `}>
                    
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className={`w-10 h-10 shrink-0 ${res.isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate flex items-center gap-2">
                          {res.title}
                          {res.isActive && (
                            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-purple-600 text-white rounded">Active</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Uploaded on {new Date(res.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      {/* Set Active */}
                      {!res.isActive && (
                        <button
                          onClick={() => handleSetAgentActive(res._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-600/10 text-purple-500 transition-colors"
                        >
                          Make Active
                        </button>
                      )}
                      
                      {/* Download */}
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-white"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(res._id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}

                {(!resumes || resumes.length === 0) && (
                  <div className="py-12 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                    No resume versions uploaded yet.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageResume;
