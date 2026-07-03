import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFile } from '../../services/api';
import toast from 'react-hot-toast';

const Dropzone = ({ onUploadSuccess, folder = 'general', acceptType = 'image' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgress(50);
      const res = await uploadFile(formData, folder);
      setProgress(90);
      
      if (res.success) {
        setFileUrl(res.url);
        toast.success(`${file.name} uploaded successfully!`);
        if (onUploadSuccess) onUploadSuccess(res.url);
      } else {
        throw new Error('Upload request failed on server');
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload ${file.name}`);
      setFileName('');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder, onUploadSuccess]);

  const accept = acceptType === 'pdf' 
    ? { 'application/pdf': ['.pdf'] } 
    : { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-purple-500 bg-purple-500/5' : 'border-gray-300 dark:border-gray-800 hover:border-purple-400'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          {uploading ? (
            <>
              <div className="w-10 h-10 border-4 border-t-purple-500 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-500">Uploading {fileName}...</p>
            </>
          ) : fileUrl ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-sm font-medium text-green-500">File uploaded successfully!</p>
              <p className="text-xs text-gray-400 max-w-[250px] truncate">{fileName}</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-gray-400" />
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop the file here' : 'Drag & drop file here, or click to browse'}
              </p>
              <p className="text-xs text-gray-400">
                {acceptType === 'pdf' ? 'PDF files up to 10MB' : 'Images (JPEG, PNG, WEBP) up to 10MB'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Uploading Progress Indicator */}
      {uploading && progress > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-purple-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Dropzone;
