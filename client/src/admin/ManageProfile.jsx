import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchProfile, updateProfile } from '../services/api';
import Dropzone from '../components/UI/Dropzone';
import { Save, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageProfile = () => {
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [location, setLocation] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile-data'],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setTitle(profile.title || '');
      setSubTitle(profile.subTitle || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl || '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-profile-data']);
      toast.success('Profile details saved successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!fullName) {
      toast.error('Full Name is required');
      return;
    }

    updateMutation.mutate({
      fullName,
      title,
      subTitle,
      bio,
      avatarUrl,
      location,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        <p className="text-sm text-gray-500">Configure public profile details, profile photo, and geolocation tags.</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-5">
              <h3 className="font-bold text-md border-b border-gray-150 dark:border-gray-850 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> Bio & Avatar settings
              </h3>

              {/* Avatar upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Photo *</label>
                {avatarUrl ? (
                  <div className="relative rounded-full overflow-hidden border border-gray-200 dark:border-gray-850 w-32 h-32 bg-gray-900 mx-auto">
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-650 text-white hover:bg-red-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Dropzone onUploadSuccess={setAvatarUrl} folder="Profile" acceptType="image" />
                )}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Yatnesh"
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Software Engineer & Researcher"
                />
              </div>

              {/* SubTitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub Title (Hook)</label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Crafting premium digital experiences."
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location / Geotag</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="India"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Short Bio description</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-850 bg-transparent"
                  placeholder="Highly motivated developer with experience building Node and React platforms."
                />
              </div>

            </div>

            <div className="flex justify-end max-w-2xl">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium text-sm transition-transform active:scale-95 shadow-lg shadow-purple-600/20"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageProfile;
