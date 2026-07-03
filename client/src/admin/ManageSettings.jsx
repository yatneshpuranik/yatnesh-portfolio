import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchSettings, updateSettings } from '../services/api';
import Editor from '../components/UI/Editor';
import { Sparkles, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSettings = () => {
  const queryClient = useQueryClient();

  // Form states
  const [siteName, setSiteName] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings-data'],
    queryFn: fetchSettings,
  });

  // Load values once fetched
  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName || '');
      setTitle(settings.title || '');
      setTagline(settings.tagline || '');
      setAboutMe(settings.aboutMe || '');
      setContactEmail(settings.contactEmail || '');
      setSeoTitle(settings.seoTitle || '');
      setSeoDescription(settings.seoDescription || '');
      setSeoKeywords(settings.seoKeywords ? settings.seoKeywords.join(', ') : '');
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings-data']);
      toast.success('Site configurations saved successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleSave = (e) => {
    e.preventDefault();

    const kwArray = seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
    const payload = {
      siteName,
      title,
      tagline,
      aboutMe,
      contactEmail,
      seoTitle,
      seoDescription,
      seoKeywords: kwArray,
    };

    updateMutation.mutate(payload);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        <p className="text-sm text-gray-500 font-medium">Configure site headers, meta data, SEO rules, and default templates.</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* General Site info */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-4">
              <h3 className="font-bold text-md border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> General Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Site Brand Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                    placeholder="Yatnesh Portfolio"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Form Receive Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent font-mono"
                    placeholder="admin@portfolio.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Site Main Header Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Yatnesh | Software Engineer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Header Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Building the future with code and research."
                />
              </div>
            </div>

            {/* About Me content */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-4">
              <h3 className="font-bold text-md border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> About Section Writeup
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detailed Bio (Supports rich formatting)</label>
                <Editor value={aboutMe} onChange={setAboutMe} />
              </div>
            </div>

            {/* SEO configuration */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-4">
              <h3 className="font-bold text-md border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> SEO & Open Graph Tags
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Yatnesh - Software Engineer Portfolio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO Meta Description</label>
                <textarea
                  rows="3"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Welcome to my full-stack programming portfolio and academic publication archive."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Developer, Research Papers, Node.js, Mongoose"
                />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium text-sm transition-transform active:scale-95 shadow-lg shadow-purple-600/20"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageSettings;
