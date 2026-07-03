import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import MainLayout from '../layout/MainLayout';

const PDFView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pdfUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'Document Viewer';

  if (!pdfUrl) {
    return (
      <MainLayout>
        <div className="py-24 text-center space-y-4">
          <FileText className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">No Document Provided</h2>
          <p className="text-gray-500">Please provide a valid document URL to preview.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </MainLayout>
    );
  }

  // Google docs viewer endpoint as a backup
  const iframeUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <MainLayout>
      <div className="py-8 space-y-6">
        
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium hover:text-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <h2 className="text-lg font-bold truncate max-w-md hidden sm:block">{title}</h2>

          <div className="flex gap-2">
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Direct</span>
            </a>
          </div>
        </div>

        {/* PDF Reader Body */}
        <div className="rounded-xl overflow-hidden border border-gray-250 dark:border-gray-850 h-[75vh] bg-white dark:bg-[#0b0f19] relative shadow-lg">
          {/* We embed pdf natively, falling back to Google Docs iframe if browser has no native PDF helper */}
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            <iframe
              src={iframeUrl}
              title="PDF Reader Frame"
              className="w-full h-full border-none"
              loading="lazy"
            >
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Your browser does not support inline PDF viewing.</p>
                <a
                  href={pdfUrl}
                  download
                  className="px-6 py-2.5 rounded-lg bg-purple-600 text-white"
                >
                  Download File
                </a>
              </div>
            </iframe>
          </object>
        </div>

      </div>
    </MainLayout>
  );
};

export default PDFView;
